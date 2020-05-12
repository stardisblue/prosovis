import React from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import { RelationEvent } from '../models';
import { useSelector } from 'react-redux';
import { selectRelationGhosts } from '../selectRelations';
import {
  selectIntersection,
  selectSortedGhosts,
  selectDisplayedActorRingLinks,
} from './selectors';
import { createSelector } from 'reselect';

const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

const selectGroups = createSelector(
  selectSortedGhosts,
  selectDisplayedActorRingLinks,
  (sorted, links) =>
    _(Array.from(links.values()))
      .concat(sorted)
      .groupBy('target')
      .mapValues((links) => _(links).map('source').keyBy().value())
      .value()
);

export const SuggestionNodes: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  color: string | null | undefined;
  x: (v: number) => number;
}> = function ({ $g, color, x }) {
  const sorted = useSelector(selectSortedGhosts);
  const domain = d3.extent<number>(_.map(sorted, 'd')) as [number, number];

  const grouped = useSelector(selectGroups);
  y.domain(domain);

  return (
    <g ref={$g} fill={color || '#6c757d'}>
      {_.map(sorted, (datum) => (
        <SuggestionNode
          key={datum.target}
          datum={datum}
          x={x}
          y={y}
          actors={grouped[datum.target]}
        />
      ))}
    </g>
  );
};

export const SuggestionNode: React.FC<{
  actors: { [k: number]: number };
  datum: RelationEvent;
  x: (value: number) => number;
  y: d3.ScaleLogarithmic<number, number>;
}> = function ({ actors, datum, x, y }) {
  const ghosts = useSelector(selectRelationGhosts);

  const active = useSelector(selectIntersection);

  return (
    <g
      transform={`rotate(${
        (x(datum.target) * 180) / Math.PI
      }) translate(200,0)`}
      opacity={active ? (actors[active.actor] ? 1 : 0.3) : undefined}
    >
      <circle r={5} />
      <rect x={6} y={-2.5} height={5} width={y(datum.d)}></rect>
      <title>{ghosts.get(datum.target)?.label}</title>
    </g>
  );
};

export default SuggestionNode;
