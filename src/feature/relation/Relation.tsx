import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as d3 from 'd3';
import { selectSwitchActorColor } from '../../selectors/switch';

import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RelationNodes } from './RelationNodes';
import { selectRelations } from './selectRelations';
import { RelationMap, RelationEvent } from './models';

const selectNodes = createSelector(selectRelations, ({ actors }) => actors);

const selectOuters = createSelector(selectRelations, ({ outers }) => outers);

const selectLinks = createSelector(selectRelations, ({ inners }) => inners);

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-300))
  .force(
    'link',
    d3
      .forceLink()
      .id((d: any) => d.id)
      .distance(100)
  )
  // .force('center', d3.forceCenter())
  .force('x', d3.forceX())
  .force('y', d3.forceY());

const x = d3.scaleBand().range([0, 2 * Math.PI]);

const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

const Relation: React.FC = function () {
  const $nodeGroup = useRef<SVGGElement>(null as any);
  const $linkGroup = useRef<SVGGElement>(null as any);
  const $ghostRing = useRef<SVGGElement>(null as any);

  const [dims, setDims] = useState<DOMRect>();

  const nodes = useSelector(selectNodes);
  const links = useSelector(selectLinks);
  const outers = useSelector(selectOuters);
  const color = useSelector(selectSwitchActorColor);

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

  const updateRef = useRef<{
    nodes: () => void;
    links: () => void;
    // ghosts: (scale: d3.ScaleBand<string>) => void;
  }>(null as any);

  useEffect(function () {
    simulation.on('tick', ticked);
    const $links = $linkGroup.current.childNodes;
    const $nodes = $nodeGroup.current.childNodes;
    // const $ghosts = $ghostRing.current.childNodes;

    let link: any = d3.selectAll($links as any);
    let node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
    // let ghosts = d3.selectAll($ghosts as any);

    updateRef.current = {
      nodes: function () {
        node = d3.selectAll<SVGGElement, d3.SimulationNodeDatum>($nodes as any);
        simulation.nodes(node.data());
        simulation.alpha(1).restart();
      },

      links: function () {
        link = d3.selectAll($links as any);
        (simulation.force('link') as any).links(link.data());
        simulation.alpha(1).restart();
      },
      // ghosts: function () {
      //   ghosts = d3.selectAll($ghosts as any);
      // },
    };

    function ticked() {
      node.attr('transform', (d: any) => `translate(${d.x} ${d.y})`);
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
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

  const [ghosts, setGhosts] = useState<{ items: RelationMap; lock: boolean }>({
    items: new Map(),
    lock: false,
  });

  const handleAwayClick = useCallback(
    () =>
      setGhosts({
        items: new Map(),
        lock: false,
      }),
    []
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
      <g ref={$linkGroup} stroke="#6c757d" strokeWidth={1.5}>
        {useMemo(
          () =>
            Array.from(links, ([key, datum]) => (
              <RelationLinks key={key} datum={datum} />
            )),
          [links]
        )}
      </g>
      <g ref={$nodeGroup} stroke="#fff" strokeWidth={1.5}>
        {useMemo(
          () =>
            Array.from(nodes, ([key, datum]) => (
              <RelationNodes
                key={key}
                datum={datum}
                color={color}
                outers={outers.get(key)!}
                setGhosts={setGhosts}
              />
            )),
          [nodes, color, outers]
        )}
      </g>

      <g ref={$ghostRing} fill="#6c757d">
        {useMemo(() => {
          const sorted = _.orderBy(Array.from(ghosts.items.values()), [
            'med',
            'd',
          ]);

          // console.log(sorted);
          x.domain(_.map(sorted, 'id'));
          const domain = d3.extent<number>(_.map(sorted, 'd')) as [
            number,
            number
          ];
          y.domain(domain);
          return _.map(sorted, (datum) => (
            <Ghost key={datum.id} datum={datum} />
          ));
        }, [ghosts.items])}
      </g>
    </svg>
  );
};

export const Ghost: React.FC<{ datum: RelationEvent }> = function ({ datum }) {
  return (
    <g
      transform={`rotate(${
        ((x(datum.id)! + x.bandwidth() / 2) * 180) / Math.PI + 90
      })translate(200,0)`}
    >
      <circle r={5}></circle>
      <rect x={6} y={-2.5} height={5} width={y(datum.d)}></rect>
    </g>
  );
};

export const RelationLinks: React.FC<any> = function ({ datum }) {
  const $line = useRef<SVGLineElement>(null as any);
  // on first render
  useEffect(function () {
    // ($line.current as any).__data__ = datum; // cheating
    const d3G = d3.select($line.current).datum(datum);

    return () => {
      d3G.datum(null); // cleaning because i'm a good boy
    };
    // eslint-disable-next-line
  }, []);

  return <line ref={$line}></line>;
};

export default Relation;
