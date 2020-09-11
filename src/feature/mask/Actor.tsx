import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { selectSwitchActorColor } from '../../selectors/switch';
import { actorMaskState, selectActorMask } from '../../selectors/mask';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import ActorLabel from '../../components/ActorLabel';
import { SiprojurisActor } from '../../data/sip-models';

const Actor: React.FC<{
  actor: SiprojurisActor;
}> = function ({ actor }) {
  const { id } = actor;

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
      <ActorLabel as="span" actor={actor} short />
    </CheckBoxSwitch>
  );
};

export default Actor;
