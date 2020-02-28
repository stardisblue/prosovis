import React, { useCallback, useMemo } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { AnyEvent, PrimaryKey } from '../../data';
import { selectBorderColor, selectActorColor } from '../../selectors/color';
import { selectSwitch } from '../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import StyledIcon from './StyledIcon';

const selectIcon = createSelector(
  selectSwitch,
  selectActorColor,
  selectBorderColor,
  (switcher, main, border) => {
    return (id: PrimaryKey) => {
      return (
        <StyledIcon
          className="br-100 mh1 dib ba"
          background={switcher === 'Actor' ? main(id as string) : 'gray'}
          border={switcher === 'Actor' ? border(id as string) : 'black'}
        />
      );
    };
  }
);

const Actor: React.FC<{
  actor: AnyEvent['actor'];
  state: boolean;
}> = function({ actor, state }) {
  const dispatch = useDispatch();

  const iconFun = useSelector(selectIcon);

  const icon = useMemo(() => iconFun(actor.id), [iconFun, actor.id]);

  const handleCheck = useCallback(() => {
    dispatch(toggleActorMask(actor.id));
  }, [dispatch, actor.id]);

  return (
    <Flex tag="label" className="ph2" items="baseline">
      <input type="checkbox" checked={state} onChange={handleCheck} />
      {icon} {actor.label}
    </Flex>
  );
};

export default Actor;
