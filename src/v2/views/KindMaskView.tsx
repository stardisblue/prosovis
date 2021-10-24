import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUniqueKinds } from '../selectors/events';
import { selectActiveKinds } from '../selectors/mask/kind';
import { map } from 'lodash/fp';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { toggleMaskKind } from '../reducers/mask/kindSlice';
import Loading from '../components/Loading';
import { selectSwitchKindColor } from '../../selectors/switch';
import { SmallFont } from '../../feature/mask/styled-components';
import theme from '../components/theme';
import styled from 'styled-components/macro';

const MinWidthLoader = styled(Loading)`
  min-width: 100px;
`;
export const KindMaskView: React.FC = function () {
  const kinds = useSelector(selectUniqueKinds);

  return (
    <MinWidthLoader finished={kinds} size={1}>
      <StyledFlex>
        {map(
          (kind) => (
            <Kind key={kind} kind={kind} />
          ),
          kinds
        )}
      </StyledFlex>
    </MinWidthLoader>
  );
};

const Kind: React.FC<{ kind: string }> = function ({ kind }) {
  const dispatch = useDispatch();

  const mask = useSelector(selectActiveKinds);
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
