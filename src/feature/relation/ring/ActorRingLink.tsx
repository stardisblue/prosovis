import React from 'react';
import { toCartesian } from '../../../utils';
import useD3 from '../../../hooks/useD3';
import { selectRelationNodes } from '../selectRelations';
import { useSelector } from 'react-redux';
import { ScaleBand } from 'd3-scale';
import { RelationEvent } from '../models';
import { selectSwitchActorColor } from '../../../selectors/switch';
// import _ from 'lodash';
export const ActorRingLink: React.FC<{
  datum: RelationEvent;
  x: ScaleBand<number>;
}> = function ({ datum, x }) {
  const color = useSelector(selectSwitchActorColor);
  // const { locLinks } = useSelector(selectRelations);
  // const activeRelation = useSelector(selectRelationSelection);

  const nodes = useSelector(selectRelationNodes);

  const $line = useD3<SVGLineElement>(datum);

  const { x: x1, y: y1 } = toCartesian({
    theta: x(datum.target)! + (x.bandwidth() + Math.PI) / 2,
    length: 200,
  });

  const { x: x2, y: y2 } = nodes.get(datum.source)! as any;

  return (
    <line
      ref={$line}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={{ mixBlendMode: 'multiply' }}
      stroke={color ? color(datum.source) : undefined}
      // strokeWidth={activeRelation!.actor === datum.source ? 2 : 1}
      // opacity={activeRelation!.actor === datum.source ? 1 : 0.5}
    />
  );
};

export default ActorRingLink;
