import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleKindMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectSwitchKindColor } from '../../selectors/switch';
import CheckBoxSwitch from './CheckBoxSwitch';
import { kindMaskState, selectKindMask } from '../../selectors/mask';

const Kind: React.FC<{
  id: AnyEvent['kind'];
}> = function({ id }) {
  const dispatch = useDispatch();

  const color = useSelector(selectSwitchKindColor);
  const kindMask = useSelector(selectKindMask);

  const handleCheck = useCallback(() => {
    dispatch(toggleKindMask(id));
  }, [dispatch, id]);

  return (
    <CheckBoxSwitch
      color={color ? color(id) : 'gray'}
      checked={kindMaskState(id, kindMask)}
      handleCheck={handleCheck}
    >
      {id}
    </CheckBoxSwitch>
  );
};

export default Kind;
