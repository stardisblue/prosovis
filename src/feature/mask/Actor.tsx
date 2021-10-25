import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActorLabel from '../../components/ActorLabel';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import { toggleActorMask } from '../../reducers/maskSlice';
import { actorMaskState, selectActorMask } from '../../selectors/mask';
import { selectSwitchActorColor } from '../../selectors/switch';
import { darkgray } from '../../v2/components/theme';
import { ProsoVisActor } from '../../v2/types/actors';
import { SmallFont } from './styled-components';

const Actor: React.FC<{
  actor: ProsoVisActor;
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
      <ActorLabel as={SmallFont} id={actor} short />
    </CheckBoxSwitch>
  );
};

export default Actor;
