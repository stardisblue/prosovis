import React, { useMemo } from 'react';
import _ from 'lodash';

import * as d3 from 'd3';
import { LocEvents } from '../models';
import PiePart from './PiePart';
import { useDatum } from '../../../hooks/useD3';
import { useSelector } from 'react-redux';
import { selectRelationActorRing } from '../selectRelations';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { darkgray } from '../../../components/ui/colors';
import { ProsoVisActor } from '../../../v2/types/actors';

const scale = d3.scaleSqrt().range([0, 3]);

export const RelationNode: React.FC<{
  datum: ProsoVisActor & d3.SimulationNodeDatum;
}> = function ({ datum }) {
  const $g = useDatum<SVGGElement, ProsoVisActor>(datum);
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
    <g ref={$g} fill={color ? color(datum.id) : darkgray} cursor="pointer">
      <circle r={scale(ghosts.size)} fill={'white'} />
      {_.map(arcs, (a) => (
        <PiePart key={a.data[0]} parent={datum.id} a={a} arc={arc} />
      ))}
    </g>
  );
};

export default RelationNode;
