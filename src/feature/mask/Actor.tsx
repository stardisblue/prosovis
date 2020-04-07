import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectSwitchActorColor } from '../../selectors/switch';
import { actorMaskState, selectActorMask } from '../../selectors/mask';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';

const Actor: React.FC<{
  actor: AnyEvent['actor'];
}> = function ({ actor }) {
  const { id, label } = actor;

  const dispatch = useDispatch();

  const color = useSelector(selectSwitchActorColor);
  const actorMask = useSelector(selectActorMask);

  const handleCheck = useCallback(() => {
    dispatch(toggleActorMask(id));
  }, [dispatch, id]);

  return (
    <CheckBoxSwitch
      color={color ? color(id) : '#6c757d'}
      checked={actorMaskState(actor, actorMask)}
      handleCheck={handleCheck}
    >
      {label}
    </CheckBoxSwitch>
  );
};

export default Actor;
