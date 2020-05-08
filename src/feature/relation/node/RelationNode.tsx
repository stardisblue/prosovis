import React, { useMemo } from 'react';
import _ from 'lodash';

import * as d3 from 'd3';
import { LocEvents, RelationNodeType } from '../models';
import PiePart from './PiePart';
import useD3 from '../../../hooks/useD3';
import { useSelector } from 'react-redux';
import { selectRelationActorRing } from '../selectRelations';
import { selectSwitchActorColor } from '../../../selectors/switch';

const scale = d3.scaleSqrt().range([0, 3]);

export const RelationNode: React.FC<{
  datum: RelationNodeType;
}> = function ({ datum }) {
  const $g = useD3<SVGGElement, RelationNodeType>(datum);
  const { locsLinks, ghosts } = useSelector(selectRelationActorRing).get(
    datum.id
  )!;

  const color = useSelector(selectSwitchActorColor);

  const arcs = useMemo(
    () =>
      d3
        .pie<LocEvents>()
        .sort(null)
        .value(([, d]) => d.size)(Array.from(locsLinks)),
    [locsLinks]
  );

  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<LocEvents>>()
        .innerRadius(0)
        .outerRadius(scale(ghosts.size)),
    [ghosts.size]
  );

  return (
    <g ref={$g} fill={color ? color(datum.id) : '#6c757d'}>
      <circle r={scale(ghosts.size)} fill={'white'} />
      {_.map(arcs, (a) => (
        <PiePart key={a.data[0]} parent={datum.id} a={a} arc={arc} />
      ))}
    </g>
  );
};

export default RelationNode;