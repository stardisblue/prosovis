import React, { useCallback, useMemo } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { toggleActorMask } from '../../reducers/maskSlice';
import { AnyEvent, PrimaryKey } from '../../data';
import { selectBorderColor, selectActorColor } from '../../selectors/color';
import { selectSwitch } from '../../reducers/switchSlice';
import { createSelector } from '@reduxjs/toolkit';

const selectIcon = createSelector(
  selectSwitch,
  selectActorColor,
  selectBorderColor,
  (switcher, main, border) => {
    return (id: PrimaryKey) => {
      return (
        <i
          className="br-100 mh1 dib ba"
          style={{
            backgroundColor: switcher === 'Actor' ? main(id as string) : 'gray',
            borderColor: switcher === 'Actor' ? border(id as string) : 'black',
            height: '12px',
            width: '12px'
          }}
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
    <Flex tag="label" className="ph2" col items="baseline">
      <input type="checkbox" checked={state} onChange={handleCheck} />
      {icon} {actor.label}
    </Flex>
  );
};

export default Actor;
