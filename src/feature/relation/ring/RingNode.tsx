import React from 'react';

import { RelationEvent } from '../models';
import { useSelector } from 'react-redux';
import { selectRelationGhosts } from '../selectRelations';
import { ScaleBand, ScaleLogarithmic } from 'd3-scale';

export const RingNode: React.FC<{
  datum: RelationEvent;
  x: ScaleBand<number>;
  y: ScaleLogarithmic<number, number>;
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

export default RingNode;
