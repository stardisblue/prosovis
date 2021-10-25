import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as d3 from 'd3';
import { debounce, transform } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import { useDatum } from '../../hooks/useD3';
import { selectLocalisations } from '../../v2/selectors/localisations';
import { selectRelationEmphasis } from './highlightSlice';
import RelationNode from './node/RelationNode';
import { clearRelationSelection } from './selectionSlice';
import { selectRelationLinks, selectRelationNodes } from './selectRelations';
import path from './suggestion-ring/path';
import SuggestionRing from './suggestion-ring/SuggestionRing';
import { getSimulation } from './utils/simulation';
import { darkgray } from '../../v2/components/theme';

function useDimensions() {
  const [dims, setDims] = useState<DOMRect>();
  const $svg = useCallback(function (dom: SVGSVGElement | null) {
    if (!dom) return;
    const handleResize = debounce(100, function () {
      setDims(dom.getBoundingClientRect());
    });

    window.addEventListener('resize', handleResize);
    handleResize();

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { dims, $svg };
}

const simulation = getSimulation((d: any) => d.id);

const Relation: React.FC<{ className?: string }> = function ({ className }) {
  const dispatch = useDispatch();

  const $nodeGroup = useRef<SVGGElement>(null as any);
  const $linkGroup = useRef<SVGGElement>(null as any);
  // const $ghostRing = useRef<SVGGElement>(null as any);
  const $ringLinksGroup = useRef<SVGGElement>(null as any);

  const { dims, $svg } = useDimensions();

  const nodes = useSelector(selectRelationNodes);
  const links = useSelector(selectRelationLinks);

  const updateRef = useRef<{
    nodes: () => void;
    links: () => void;
    ringLinks: () => void;
  }>(null as any);

  useEffect(function () {
    simulation.on('tick', ticked);

    const $links = $linkGroup.current.childNodes;
    const $nodes = $nodeGroup.current.childNodes;
    const $ringLinks = $ringLinksGroup.current.childNodes;

    let link: any = d3.selectAll($links as any);
    let node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
    let ringLink = d3.selectAll($ringLinks as any);

    let nodeMap = new Map();

    updateRef.current = {
      nodes: function () {
        node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
        nodeMap = transform(
          (m, n: any) => m.set(n.id!, n),
          new Map(),
          node.data()
        );
        simulation.nodes(node.data());
        simulation.alpha(1).restart();
      },

      links: function () {
        link = d3.selectAll($links as any);
        (
          simulation.force('link') as d3.ForceLink<
            d3.SimulationNodeDatum,
            d3.SimulationLinkDatum<d3.SimulationNodeDatum>
          >
        ).links(link.data());
        simulation.alpha(1).restart();
      },
      ringLinks: function () {
        ringLink = d3.selectAll($ringLinks as any);
        ringLink.attr('d', ([d, points]: any) => {
          if (nodeMap.has(d.source)) {
            const { x = 0, y = 0 } = nodeMap.get(d.source) as any;
            return path([[x, y], ...points]);
          }
          return '';
        });
      },
    };

    function ticked() {
      // node.attr('transform', (d: any) => `translate(${d.x}, ${d.y}, 0)`);
      node.style('transform', (d: any) => `translate3d(${d.x}px, ${d.y}px, 0)`);

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      ringLink.attr('d', ([d, points]: any) => {
        if (nodeMap.has(d.source)) {
          const { x = 0, y = 0 } = nodeMap.get(d.source) as any;
          return path([[x, y], ...points]);
        }
        return '';
      });
      // .attr('y2', (d: any) => (nodeMap.get(d.source) as any)!.y);
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

  const handleAwayClick = useCallback(
    () => dispatch(clearRelationSelection()),
    [dispatch]
  );

  return (
    <svg
      className={className}
      ref={$svg}
      width="100%"
      height="100%"
      viewBox={
        dims &&
        `${-dims.width / 2},${-dims.height / 2},${dims.width},${dims.height}`
      }
      onMouseUp={handleAwayClick}
    >
      <PlaceText offset={dims} />
      <SuggestionRing
        /*$nodes={$ghostRing}*/
        $links={$ringLinksGroup}
        updateLinkPosition={updateRef}
      />

      <g ref={$linkGroup} stroke={darkgray} strokeWidth={1.5}>
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
    </svg>
  );
};

export const PlaceText: React.FC<any> = function ({ offset }) {
  const emph = useSelector(selectRelationEmphasis);
  const localisations = useSelector(selectLocalisations) ?? {};

  return (
    <text
      x={offset && -offset.width / 2}
      y={offset && 32 - offset.height / 2}
      fontSize="1em"
    >
      {emph && localisations[emph.loc]?.label}
    </text>
  );
};

export const RelationLink: React.FC<any> = function ({ datum }) {
  // on first render
  const $line = useDatum<SVGLineElement>(datum);

  return <line ref={$line}></line>;
};

export default Relation;
