import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';
import * as d3 from 'd3';
import rawNodes from '../../data/actor-nodes.json';
import rawLinks from '../../data/known_links.json';
import { selectActors } from '../../selectors/event';
import { selectSwitchActorColor } from '../../selectors/switch';

import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RelationNodes, RelationMap, RelationEvent } from './RelationNodes';

type ActorRelationsMap = Map<number, RelationMap>;
type RelationNode = {
  kind: string;
  id: number;
  label: string;
  uri: string;
  url: string;
};

const selectRelations = createSelector(selectActors, (actors) => {
  return _.transform(
    rawLinks,
    (map, link) => {
      const source = link.actors[0];
      const target = link.actors[1];
      if (actors[source] && actors[target]) {
        map.inners.set(link.actors.join(':'), link);
      } else if (actors[source]) {
        addRelation(map, rawNodes, source, target, link.actors.join(':'), link);
      } else if (actors[target]) {
        addRelation(map, rawNodes, target, source, link.actors.join(':'), link);
      }
    },
    {
      outers: new Map<
        number,
        { count: Set<number>; items: ActorRelationsMap }
      >(),
      inners: new Map<string, RelationEvent>(),
      actors: new Map<number, any>(),
    }
  );
});

const selectNodes = createSelector(selectActors, (actors) => {
  return _.map(actors, (a) => {
    const node = _.get<RelationNode>(rawNodes, a.id as number);
    return { id: node.id, data: node };
  });
});

function addRelation<N, Nodes>(
  map: {
    outers: Map<number, { count: Set<number>; items: ActorRelationsMap }>;
    actors: Map<number, N>;
  },
  rawNodes: Nodes,
  nodeId: number,
  other: number,
  linkId: string,
  link: any
) {
  if (!map.outers.has(nodeId)) {
    map.outers.set(nodeId, { count: new Set(), items: new Map() });
  }
  map.outers.get(nodeId)!.count.add(other);
  const nodegroup = map.outers.get(nodeId)!.items;

  if (!nodegroup.has(link.loc)) {
    nodegroup.set(link.loc, new Map());
  }

  nodegroup.get(link.loc)!.set(linkId, link);

  if (!map.actors.has(nodeId)) {
    map.actors.set(nodeId, _.get(rawNodes, nodeId));
  }
}

const selectLinks = createSelector(selectRelations, ({ inners }) => {
  return Array.from(inners, ([key, value]) => ({
    id: key,
    source: value.actors[0],
    target: value.actors[1],
    data: value,
  }));
});

const Relation: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const [dims, setDims] = useState<DOMRect>();
  const nodes = useSelector(selectNodes);
  const links = useSelector(selectLinks);
  const relations = useSelector(selectRelations);
  const color = useSelector(selectSwitchActorColor);

  useEffect(() => {
    console.log(relations);
  }, [relations]);

  useLayoutEffect(function () {
    const handleResize = _.debounce(function () {
      setDims($svg.current.getBoundingClientRect());
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
  }>(null as any);

  useEffect(function () {
    const svg = d3.select($svg.current);

    const simulation = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-1000))
      .force(
        'link',
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(200)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', ticked);

    const linksNode: SVGGElement = svg.select<SVGGElement>('g.links').node()!;
    let link: any = d3.selectAll(linksNode.childNodes as any);
    const nodesNode: SVGGElement = svg.select<SVGGElement>('g.nodes').node()!;
    let node: any = d3.selectAll(nodesNode.childNodes as any);

    updateRef.current = {
      nodes: function () {
        node = d3.selectAll(nodesNode.childNodes as any);

        console.log(node);
        simulation.nodes(node.data());
        simulation.alpha(1).restart();
      },

      links: function () {
        link = d3.selectAll(linksNode.childNodes as any);
        (simulation.force('link') as any).links(link.data());
        simulation.alpha(1).restart();
      },
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

  const linkList = useMemo(
    () =>
      _.map(links, (datum) => <RelationLinks key={datum.id} datum={datum} />),
    [links]
  );

  const nodeList = useMemo(
    () =>
      _.map(nodes, (datum) => (
        <RelationNodes
          key={datum.id}
          datum={datum}
          color={color}
          outers={relations.outers.get(datum.id)}
        />
      )),
    [nodes, color, relations.outers]
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
    >
      <g className="links" stroke="#000" strokeWidth={1.5}>
        {linkList}
      </g>
      <g className="nodes" stroke="#fff" strokeWidth={1.5}>
        {nodeList}
      </g>
    </svg>
  );
};

export const RelationLinks: React.FC<any> = function ({ datum }) {
  const $line = useRef<SVGLineElement>(null as any);

  useEffect(function () {
    ($line.current as any).__data__ = datum;
    // on first render
    // eslint-disable-next-line
  }, []);
  return <line ref={$line}></line>;
};

export default Relation;
