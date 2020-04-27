import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';

import * as d3 from 'd3';
import { LocEvents, RelationNode, ActorRelationsMap } from './models';
const scale = d3.scaleSqrt().range([0, 3]);

export const RelationNodes: React.FC<{
  datum: RelationNode;
  color: d3.ScaleOrdinal<string | number, string> | null;
  outers: {
    count: Set<number>;
    items: ActorRelationsMap;
  };
}> = function ({ datum, color, outers }) {
  const $g = useRef<SVGCircleElement>(null as any);
  useEffect(function () {
    // ($g.current as any).__data__ = datum; // cheating
    const d3G = d3.select($g.current).datum(datum);

    return () => {
      d3G.datum(null); // cleaning because i'm a good boy
    };
    // on first render
    // eslint-disable-next-line
  }, []);

  const arcs = useMemo(
    () =>
      d3
        .pie<LocEvents>()
        .sort(null)
        .value(([, d]) => d.size)(Array.from(outers.items)),
    [outers.items]
  );

  console.log(arcs);

  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<LocEvents>>()
        .innerRadius(0)
        .outerRadius(scale(outers.count.size)),
    [outers.count.size]
  );

  return (
    <g ref={$g} fill={color ? color(datum.id) : '#6c757d'}>
      {/* <circle r={6} fill={color ? color(datum.id) : 'white'} /> */}
      {_.map(arcs, (a) => (
        <PiePart key={a.data[0]} a={a} arc={arc} />
      ))}
    </g>
  );
};

export const PiePart: React.FC<{
  a: d3.PieArcDatum<LocEvents>;
  arc: d3.Arc<any, d3.PieArcDatum<LocEvents>>;
}> = function ({ arc, a }) {
  const handleMouseEnter = useCallback(() => {
    console.log(Array.from(a.data[1], ([k, v]) => v.target).sort());
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
