import _ from 'lodash';
import React, { useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { clearSuperHighlightThunk } from '../../thunks/highlights';
import { useDispatch } from 'react-redux';

type MouseEventFn = (
  event: React.MouseEvent<SVGPathElement, MouseEvent>
) => void;
export const PieChart: React.FC<{
  radius: number;
  counts: [string, any[]][];
  color: any;
  donut?: number;
}> = function({ radius, counts, color, donut = 0 }) {
  const arcs = useMemo(
    () =>
      d3
        .pie<[string, any[]]>()
        .sort(null)
        .value(d => d[1].length)(counts),
    [counts]
  );
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<[string, any[]]>>()
        .innerRadius(donut)
        .outerRadius(donut + radius),
    [radius, donut]
  );

  return (
    <g stroke="white">
      {_.map(arcs, a => (
        <PiePath a={a} color={color} arc={arc} />
      ))}
    </g>
  );
};

export default PieChart;
export const PiePath: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  color: any;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
}> = function({ a, color, arc }) {
  const dispatch = useDispatch();
  const handleMouseOver = useCallback<React.MouseEventHandler<SVGPathElement>>(
    function() {}, // safely ignoring dispatch
    // eslint-disable-next-line
    []
  );

  const handleMouseOut = useCallback<React.MouseEventHandler<SVGPathElement>>(
    function() {
      dispatch(clearSuperHighlightThunk());
    }, // safely ignoring dispatch
    // eslint-disable-next-line
    []
  );
  const handleMouseClick = useCallback<React.MouseEventHandler<SVGPathElement>>(
    function() {
      dispatch(clearSuperHighlightThunk());
    }, // safely ignoring dispatch
    // eslint-disable-next-line
    []
  );

  return (
    <path
      key={a.data[0]}
      fill={color(a.data[0])}
      d={arc(a)!}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleMouseClick}
    >
      <title>{a.data[1].length}</title>
    </path>
  );
};
