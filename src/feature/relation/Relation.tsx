import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3';
import rawNodes from '../../data/actor-nodes.json';
import rawLinks from '../../data/known_links.json';
import { selectActors } from '../../selectors/event';
import { selectSwitchActorColor } from '../../selectors/switch';

import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const selectNodes = createSelector(selectActors, (actors) => {
  return _.map(actors, (a) => {
    const node = _.get(rawNodes, a.id);
    return { id: node.id, data: node };
  });
});

const selectRelations = createSelector(selectActors, (actors) => {
  return _.transform(
    rawLinks,
    (map, link) => {
      const source = link.actors[0];
      const target = link.actors[1];
      if (actors[source] && actors[target]) {
        map.inners.set(link.actors.join(':'), link);
      } else if (actors[source]) {
        map.outers.set(link.actors.join(':'), link);
        if (!map.actors.has(target)) {
          map.actors.set(target, _.get(rawNodes, target));
        }
      } else if (actors[target]) {
        map.outers.set(link.actors.join(':'), link);
        if (!map.actors.has(source)) {
          map.actors.set(source, _.get(rawNodes, source));
        }
      }
    },
    {
      outers: new Map(),
      inners: new Map(),
      actors: new Map(),
    }
  );
});

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
    nodes: (nodes: any) => void;
    links: (nodes: any) => void;
    color: (color: any | null) => void;
  }>(null as any);

  useEffect(function () {
    const svg = d3.select($svg.current);

    const simulation: d3.Simulation<
      d3.SimulationNodeDatum,
      d3.SimulationLinkDatum<d3.SimulationNodeDatum>
    > = d3
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

    let link: any = svg
      .append('g')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('line');

    let node: any = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle');

    updateRef.current = {
      nodes: function (nodes: any) {
        node = node
          .data(nodes, (d: any) => d.id)
          .join((enter: any) => enter.append('circle').attr('r', 8));
        console.log(node);

        simulation.nodes(nodes);
        simulation.alpha(1).restart();
      },

      links: function (links: any) {
        link = link.data(links, (d: any) => d.data.actors).join('line');
        console.log(link.data());
        simulation
          .force<
            d3.ForceLink<
              d3.SimulationNodeDatum,
              d3.SimulationLinkDatum<d3.SimulationNodeDatum>
            >
          >('link')!
          .links(links);
        simulation.alpha(1).restart();
      },
      color: function (color: any | null) {
        if (color) {
          node.attr('fill', (d: any) => color(d.id));
        } else {
          node.attr('fill', null);
        }
      },
    };
    function ticked() {
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
    }
  }, []);

  useEffect(
    function () {
      updateRef.current.nodes(nodes);
    },
    [nodes]
  );
  useEffect(
    function () {
      updateRef.current.links(links);
    },
    [links]
  );

  useEffect(
    function () {
      updateRef.current.color(color);
    },
    [color]
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
    ></svg>
  );
};

export default Relation;
