import React, { useCallback, useMemo } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { toggleKindMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectMainColor, selectBorderColor } from '../../selectors/color';
import { selectSwitch } from '../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import StyledIcon from './StyledIcon';

const selectIcon = createSelector(
  selectSwitch,
  selectMainColor,
  selectBorderColor,
  (switcher, main, border) => {
    return (id: string) => {
      return (
        <StyledIcon
          className="br-100 mh1 dib ba"
          background={switcher === 'Kind' ? main(id) : 'gray'}
          border={switcher === 'Kind' ? border(id) : 'black'}
        />
      );
    };
  }
);

const Kind: React.FC<{
  id: AnyEvent['kind'];
  state: boolean;
}> = function({ id, state }) {
  const dispatch = useDispatch();

  const iconFun = useSelector(selectIcon);

  const icon = useMemo(() => iconFun(id), [iconFun, id]);

  const handleCheck = useCallback(() => {
    dispatch(toggleKindMask(id));
  }, [dispatch, id]);

  return (
    <Flex tag="label" className="ph2" col items="baseline">
      <input type="checkbox" checked={state} onChange={handleCheck} />
      {icon} {id}
    </Flex>
  );
};

export default Kind;
