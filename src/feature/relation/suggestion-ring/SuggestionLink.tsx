import React from 'react';
import { toCartesian } from '../../../utils';
import useD3 from '../../../hooks/useD3';
// import { selectRelationNodes } from '../selectRelations';
// import { useSelector } from 'react-redux';
import { RelationEvent } from '../models';
// import _ from 'lodash';
import { line, curveBundle } from 'd3-shape';
import { useSelector } from 'react-redux';
import { selectDisplayedRingLinks } from './selectors';

const path = line().curve(curveBundle.beta(1));

export const SuggestionLinks: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  x: (value: number) => number;
}> = function ({ $g, x }) {
  // const links = useSelector(selectDisplayedRingLinks);

  return (
    <g ref={$g} stroke="#bbb" fill="none">
      {Array.from([], ([key, datum]) => (
        <SuggestionLink key={key} datum={datum} x={x} />
      ))}
    </g>
  );
};

export const SuggestionLink: React.FC<{
  datum: RelationEvent;
  x: (value: number) => number;
}> = function ({ datum, x }) {
  // const { locLinks } = useSelector(selectRelations);
  // const activeRelation = useSelector(selectRelationSelection);

  // const nodes = useSelector(selectRelationNodes);

  const $line = useD3<SVGPathElement>(datum);

  const { x: x1, y: y1 } = toCartesian({
    theta: x(datum.target),
    length: 200,
  });

  const { x: x2, y: y2 } = toCartesian({
    theta: x(datum.source),
    length: 200,
  });

  return (
    <path
      ref={$line}
      d={
        path([
          [x1, y1],
          [0, 0],
          [x2, y2],
        ])!
      }
      style={{ mixBlendMode: 'multiply' }}
      // fill="none"
      // stroke="#ccc"
    />
  );
};

export default SuggestionLink;
