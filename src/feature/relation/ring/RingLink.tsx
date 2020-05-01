import React from 'react';
import { toCartesian } from '../../../utils';
import useD3 from '../../../hooks/useD3';
// import { selectRelationNodes } from '../selectRelations';
// import { useSelector } from 'react-redux';
import { ScaleBand } from 'd3-scale';
import { RelationEvent } from '../models';
// import _ from 'lodash';
import * as d3 from 'd3-shape';

const path = d3.line().curve(d3.curveBundle.beta(0.75));

export const RingLink: React.FC<{
  datum: RelationEvent;
  x: ScaleBand<number>;
}> = function ({ datum, x }) {
  // const { locLinks } = useSelector(selectRelations);
  // const activeRelation = useSelector(selectRelationSelection);

  // const nodes = useSelector(selectRelationNodes);

  const $line = useD3<SVGPathElement>(datum);

  const { x: x1, y: y1 } = toCartesian({
    theta: x(datum.target)! + (x.bandwidth() + Math.PI) / 2,
    length: 200,
  });

  const { x: x2, y: y2 } = toCartesian({
    theta: x(datum.source)! + (x.bandwidth() + Math.PI) / 2,
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
      style={{ mixBlendMode: 'darken' }}
      // fill="none"
      // stroke="#ccc"
    />
    // <line
    //   style={{ mixBlendMode: 'darken' }}
    //   ref={$line}
    //   x1={x1}
    //   y1={y1}
    //   x2={x2}
    //   y2={y2}
    //   // strokeWidth={activeRelation!.actor === datum.source ? 2 : 1}
    //   // opacity={activeRelation!.actor === datum.source ? 1 : 0.5}
    // />
  );
};

export default RingLink;
