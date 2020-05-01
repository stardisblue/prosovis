import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import { useSelector, useDispatch } from 'react-redux';
import RelationNode from './node/RelationNode';
import { selectRelationNodes, selectRelationLinks } from './selectRelations';
import { clearRelationSelection, selectSelectedGhosts } from './selectionSlice';
import useD3 from '../../hooks/useD3';
import { ActorRingLink } from './ring/ActorRingLink';
import { RingNode } from './ring/RingNode';
import { getSimulation } from './utils/simulation';
import { selectSwitchActorColor } from '../../selectors/switch';
import { createSelector } from 'reselect';
import {
  selectHighlightedGhosts,
  selectRelationEmphasis,
} from './highlightSlice';
import RingLink from './ring/RingLink';

function useDimensions() {
  const [dims, setDims] = useState<DOMRect>();
  const $svg = useCallback(function (dom: SVGSVGElement | null) {
    if (!dom) return;
    const handleResize = _.debounce(function () {
      setDims(dom.getBoundingClientRect());
    }, 100);

    window.addEventListener('resize', handleResize);
    handleResize();

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { dims, $svg };
}

const x = d3.scaleBand<number>().range([0, 2 * Math.PI]);
const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

const simulation = getSimulation((d: any) => d.id);

const selectActiveActorColor = createSelector(
  selectSwitchActorColor,
  selectRelationEmphasis,
  (color, emph) => {
    if (!color) return null;
    if (emph) return color(emph.actor);
  }
);

const selectDisplayedRing = createSelector(
  selectSelectedGhosts,
  selectHighlightedGhosts,
  (sel, high) => (sel.ghosts.size > 0 ? sel : high)
);

const Relation: React.FC = function () {
  const dispatch = useDispatch();

  const $nodeGroup = useRef<SVGGElement>(null as any);
  const $linkGroup = useRef<SVGGElement>(null as any);
  // const $ghostRing = useRef<SVGGElement>(null as any);
  const $ghostRingLinks = useRef<SVGGElement>(null as any);

  const { dims, $svg } = useDimensions();

  const nodes = useSelector(selectRelationNodes);
  const links = useSelector(selectRelationLinks);

  const updateRef = useRef<{
    nodes: () => void;
    links: () => void;
    ghostLinks: () => void;
  }>(null as any);

  useEffect(function () {
    simulation.on('tick', ticked);
    const $links = $linkGroup.current.childNodes;
    const $nodes = $nodeGroup.current.childNodes;
    const $ghostLinks = $ghostRingLinks.current.childNodes;

    let link: any = d3.selectAll($links as any);
    let node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
    let ghostLink = d3.selectAll($ghostLinks as any);
    let nodeMap = new Map();

    updateRef.current = {
      nodes: function () {
        node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
        nodeMap = _.transform(
          node.data(),
          (m, n: any) => m.set(n.id!, n),
          new Map()
        );
        simulation.nodes(node.data());
        simulation.alpha(1).restart();
      },

      links: function () {
        link = d3.selectAll($links as any);
        (simulation.force('link') as d3.ForceLink<
          d3.SimulationNodeDatum,
          d3.SimulationLinkDatum<d3.SimulationNodeDatum>
        >).links(link.data());
        simulation.alpha(1).restart();
      },
      ghostLinks: function () {
        ghostLink = d3.selectAll($ghostLinks as any);
      },
    };

    function ticked() {
      node.attr('transform', (d: any) => `translate(${d.x} ${d.y})`);

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      ghostLink
        .attr('x2', (d: any) => (nodeMap.get(d.source) as any)!.x)
        .attr('y2', (d: any) => (nodeMap.get(d.source) as any)!.y);
    }

    return () => {
      // if the graph is reredered kill the simulation
      simulation.stop();
    };
  }, []);

  useEffect(() => {
    updateRef.current.nodes();
  }, [nodes]);

  useEffect(() => {
    updateRef.current.links();
  }, [links]);

  const ghosts = useSelector(selectDisplayedRing);

  useEffect(() => {
    updateRef.current.ghostLinks();
  }, [ghosts]);

  const color = useSelector(selectActiveActorColor);
  const handleAwayClick = useCallback(
    () => dispatch(clearRelationSelection()),
    [dispatch]
  );

  return (
    <svg
      ref={$svg}
      width="100%"
      height="100%"
      viewBox={
        dims &&
        `${-dims.width / 2},${-dims.height / 2},${dims.width},${dims.height}`
      }
      onMouseUp={handleAwayClick}
    >
      <g ref={$ghostRingLinks} stroke="#ccc" strokeWidth={1.5}>
        {useMemo(
          () =>
            Array.from(ghosts.actorRingLinks, ([key, datum]) => (
              <ActorRingLink key={key} datum={datum} x={x} />
            )),
          [ghosts.actorRingLinks]
        )}
      </g>
      <g stroke="#ccc" fill="none">
        {useMemo(
          () =>
            Array.from(ghosts.ringLinks, ([key, datum]) => (
              <RingLink key={key} datum={datum} x={x} />
            )),
          [ghosts.ringLinks]
        )}
      </g>

      <g ref={$linkGroup} stroke="#6c757d" strokeWidth={1.5}>
        {useMemo(
          () =>
            Array.from(links, ([key, datum]) => (
              <RelationLink key={key} datum={datum} />
            )),
          [links]
        )}
      </g>
      <g ref={$nodeGroup} stroke="#fff" strokeWidth={1.5}>
        {useMemo(
          () =>
            Array.from(nodes, ([key, datum]) => (
              <RelationNode key={key} datum={datum} />
            )),
          [nodes]
        )}
      </g>
      <g /*ref={$ghostRing}*/ fill={color || '#6c757d'}>
        {useMemo(() => {
          const sorted = _.orderBy(Array.from(ghosts.ghosts.values()), [
            'med',
            'd',
          ]);

          x.domain(_.map(sorted, 'target'));
          const domain = d3.extent<number>(_.map(sorted, 'd')) as [
            number,
            number
          ];
          y.domain(domain);
          return _.map(sorted, (datum) => (
            <RingNode key={datum.target} datum={datum} x={x} y={y} />
          ));
        }, [ghosts.ghosts])}
      </g>
    </svg>
  );
};

export const RelationLink: React.FC<any> = function ({ datum }) {
  // on first render
  const $line = useD3<SVGLineElement>(datum);

  return <line ref={$line}></line>;
};

export default Relation;
