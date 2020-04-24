import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';

import * as d3 from 'd3';
const scale = d3.scaleSqrt().range([0, 5]);

export type RelationEvent = any;
export type RelationMap = Map<string, RelationEvent>;
export type ActorRelations = [number, RelationMap];

export const RelationNodes: React.FC<any> = function ({
  datum,
  color,
  outers,
}) {
  const $g = useRef<SVGCircleElement>(null as any);
  useEffect(function () {
    // cheating
    const d3G = d3.select($g.current).datum(datum);
    // ($g.current as any).__data__ = datum;

    return () => {
      d3G.datum(null);
    };
    // on first render
    // eslint-disable-next-line
  }, []);

  const arcs = useMemo(
    () =>
      d3
        .pie<ActorRelations>()
        .sort(null)
        .value(([, d]) => d.size)(Array.from(outers.items)),
    [outers.items]
  );

  console.log(arcs);
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<ActorRelations>>()
        .innerRadius(6)
        .outerRadius(scale(outers.count.size) + 6),
    [outers.count.size]
  );
  return (
    <g ref={$g} fill="#6c757d">
      <circle r={6} fill={color ? color(datum.id) : 'white'} />
      {_.map(arcs, (a) => (
        <PiePart key={a.data[0]} a={a} arc={arc} />
      ))}
    </g>
  );
};

export const PiePart: React.FC<{
  a: d3.PieArcDatum<ActorRelations>;
  arc: d3.Arc<any, d3.PieArcDatum<ActorRelations>>;
}> = function ({ arc, a }) {
  const handleMouseEnter = useCallback(() => {
    console.log(a.data);
  }, [a.data]);
  const handleMouseLeave = useCallback(() => {
    // console.log(a.data);
  }, []);
  return (
    <path
      d={arc(a)!}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <title>{a.data[1].size}</title>
    </path>
  );
};

export default RelationNodes;
