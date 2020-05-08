import React from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import { RelationEvent } from '../models';
import { useSelector } from 'react-redux';
import { selectRelationGhosts } from '../selectRelations';

const y = d3.scaleLog().domain([1, 10]).range([1, 20]);

export const SuggestionNodes: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  sorted: RelationEvent[];
  color: string | null | undefined;
  x: d3.ScalePoint<number>;
}> = function ({ $g, color, sorted, x }) {
  const domain = d3.extent<number>(_.map(sorted, 'd')) as [number, number];
  y.domain(domain);
  return (
    <g ref={$g} fill={color || '#6c757d'}>
      {_.map(sorted, (datum) => (
        <SuggestionNode key={datum.target} datum={datum} x={x} y={y} />
      ))}
    </g>
  );
};

export const SuggestionNode: React.FC<{
  datum: RelationEvent;
  x: d3.ScalePoint<number>;
  y: d3.ScaleLogarithmic<number, number>;
}> = function ({ datum, x, y }) {
  const ghosts = useSelector(selectRelationGhosts);

  return (
    <g
      transform={`rotate(${
        ((x(datum.target)! + x.bandwidth() / 2) * 180) / Math.PI + 90
      })translate(200,0)`}
    >
      <circle r={5} />
      <rect x={6} y={-2.5} height={5} width={y(datum.d)}></rect>
      <title>{ghosts.get(datum.target)?.label}</title>
    </g>
  );
};

export default SuggestionNode;
