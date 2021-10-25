import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CheckBoxSwitch from '../../../components/ui/CheckBoxSwitch';
import { SmallFont } from '../../../feature/mask/styled-components';
import { darkgray } from '../../components/theme';
import {
  CustomFilterField,
  toggleCustomFilter,
} from '../../reducers/mask/customFilterSlice';

export const CustomFilterElement: React.FC<{
  kind: string;
  state: CustomFilterField;
  parent: string;
  hideNumber?: boolean;
  color?: d3.ScaleOrdinal<string, string, never>;
}> = function ({
  kind,
  state: { value, count },
  parent,
  hideNumber = false,
  color,
}) {
  const dispatch = useDispatch();

  const handleCheck = useCallback(() => {
    dispatch(toggleCustomFilter([parent, kind]));
  }, [dispatch, parent, kind]);

  return (
    <CheckBoxSwitch
      key={kind}
      checked={value !== null}
      handleCheck={handleCheck}
      color={color ? color(kind) : darkgray}
    >
      <SmallFont>
        {kind} {!hideNumber && `(${count})`}
      </SmallFont>
    </CheckBoxSwitch>
  );
};
