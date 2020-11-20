import React from 'react';
import { toCartesian } from '../../../utils';
import { useDatum } from '../../../hooks/useD3';
import path from './path';
import { ProsoVisSignedRelation } from '../../../v2/types/relations';

export const SuggestionLinks: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  x: (value: string) => number;
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
  datum: ProsoVisSignedRelation;
  x: (value: string) => number;
}> = function ({ datum, x }) {
  // const { locLinks } = useSelector(selectRelations);
  // const activeRelation = useSelector(selectRelationSelection);

  // const nodes = useSelector(selectRelationNodes);

  const $line = useDatum<SVGPathElement>(datum);

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
