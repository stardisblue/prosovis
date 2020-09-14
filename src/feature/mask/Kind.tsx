import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleKindMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data/models';
import { selectSwitchKindColor } from '../../selectors/switch';
import { kindMaskState, selectKindMask } from '../../selectors/mask';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import eventKind from '../../i18n/event-kind';
import { SmallFont } from './styled-components';
import { darkgray } from '../../components/ui/colors';

const Kind: React.FC<{
  id: AnyEvent['kind'];
}> = function ({ id }) {
  const dispatch = useDispatch();

  const color = useSelector(selectSwitchKindColor);
  const kindMask = useSelector(selectKindMask);

  const handleCheck = useCallback(() => {
    dispatch(toggleKindMask(id));
  }, [dispatch, id]);

  return (
    <CheckBoxSwitch
      color={color ? color(id) : darkgray}
      checked={kindMaskState(id, kindMask)}
      handleCheck={handleCheck}
    >
      <SmallFont> {eventKind(id)}</SmallFont>
    </CheckBoxSwitch>
  );
};

export default Kind;
