import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllKinds } from '../selectors/events';
import { selectMaskKind } from '../selectors/mask/kind';
import { map } from 'lodash/fp';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { toggleMaskKind } from '../reducers/mask/kindSlice';
import Loading from '../components/Loading';
import { selectSwitchKindColor } from '../../selectors/switch';
import { SmallFont } from '../../feature/mask/styled-components';
import theme from '../components/theme';

export const KindMaskView: React.FC = function () {
  const kinds = useSelector(selectAllKinds);

  return (
    <Loading finished={kinds} size={1.5}>
      <StyledFlex>
        {map(
          (kind) => (
            <Kind key={kind} kind={kind} />
          ),
          kinds
        )}
      </StyledFlex>
    </Loading>
  );
};

const Kind: React.FC<{ kind: string }> = function ({ kind }) {
  const dispatch = useDispatch();

  const mask = useSelector(selectMaskKind);
  const color = useSelector(selectSwitchKindColor);

  const handleCheck = useCallback(() => {
    dispatch(toggleMaskKind(kind));
  }, [dispatch, kind]);

  return (
    <CheckBoxSwitch
      key={kind}
      checked={mask[kind] === undefined}
      handleCheck={handleCheck}
      color={color ? color(kind) : theme.darkgray}
    >
      <SmallFont>{kind}</SmallFont>
    </CheckBoxSwitch>
  );
};
