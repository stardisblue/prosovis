import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { selectSwitchActorColor } from '../../selectors/switch';
import { actorMaskState, selectActorMask } from '../../selectors/mask';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import ActorLabel from '../../components/ActorLabel';
import { SiprojurisActor } from '../../data/sip-models';
import { SmallFont } from './styled-components';
import { darkgray } from '../../components/ui/colors';

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
      color={color ? color(id) : darkgray}
      checked={actorMaskState(actor, actorMask)}
      handleCheck={handleCheck}
    >
      <ActorLabel as={SmallFont} actor={actor} short />
    </CheckBoxSwitch>
  );
};

export default Actor;
