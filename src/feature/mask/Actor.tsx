import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectSwitchActorColor } from '../../selectors/switch';
import { actorMaskState, selectActorMask } from '../../selectors/mask';
import CheckBoxSwitch from './CheckBoxSwitch';

const Actor: React.FC<{
  actor: AnyEvent['actor'];
}> = function({ actor }) {
  const dispatch = useDispatch();

  const color = useSelector(selectSwitchActorColor);
  const actorMask = useSelector(selectActorMask);

  const handleCheck = useCallback(() => {
    dispatch(toggleActorMask(actor.id));
  }, [dispatch, actor.id]);

  return (
    <CheckBoxSwitch
      color={color ? color(actor.id) : 'gray'}
      checked={actorMaskState(actor, actorMask)}
      handleCheck={handleCheck}
    >
      {actor.label}
    </CheckBoxSwitch>
  );
};

export default Actor;
