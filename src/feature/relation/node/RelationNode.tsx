import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { useDatum } from '../../../hooks/useD3';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { ProsoVisActor } from '../../../v2/types/actors';
import { LocEvents } from '../models';
import { selectRelationActorRing } from '../selectRelations';
import PiePart from './PiePart';
import { darkgray } from '../../../v2/components/theme';

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
      {arcs.map((a) => (
        <PiePart key={a.data[0]} parent={datum.id} a={a} arc={arc} />
      ))}
    </g>
  );
};

export default RelationNode;
