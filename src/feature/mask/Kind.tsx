import React, { useCallback, useMemo } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { toggleKindMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectMainColor, selectBorderColor } from '../../selectors/color';
import { selectSwitch } from '../../reducers/switchSlice';
import { createSelector } from '@reduxjs/toolkit';

const selectIcon = createSelector(
  selectSwitch,
  selectMainColor,
  selectBorderColor,
  (switcher, main, border) => {
    return (id: string) => {
      return (
        <i
          className="br-100 mh1 dib ba"
          style={{
            backgroundColor: switcher === 'Kind' ? main(id) : 'gray',
            borderColor: switcher === 'Kind' ? border(id) : 'black',
            height: '12px',
            width: '12px'
          }}
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
