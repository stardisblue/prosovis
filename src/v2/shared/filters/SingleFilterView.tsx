import React, { useCallback } from 'react';
import { XIcon } from '@primer/octicons-react';
import { map } from 'lodash';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { scrollbar } from '../../../components/scrollbar';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { useFlatClick } from '../../../hooks/useClick';
import { lightgray, moongray } from '../../components/theme';
import {
  CustomFilterType,
  removeCustomFilter,
  setDefaultCustomFilter,
} from '../../reducers/mask/customFilterSlice';
import { CustomFilterElement } from './CustomFilterElement';

const CustomFilterContent = styled(StyledFlex)`
  flex-wrap: wrap;
  flex: 1;
  max-height: 10em;
  overflow-y: auto;
  margin-left: 1em;
  border-top: 2px solid ${lightgray};
  border-bottom: 2px solid ${lightgray};
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  padding-top: 0.125em;
  ${scrollbar}
`;

const StyledCode = styled.code`
  background-color: ${moongray};
  border-radius: 4px;
  padding-left: 0.125em;
  padding-right: 0.125em;
`;

export const SingleFilterView: React.FC<CustomFilterType> = function ({
  name,
  values,
  kinds,
}) {
  const dispatch = useDispatch();
  const deleteFilter = useCallback(() => {
    dispatch(removeCustomFilter(name));
  }, [dispatch, name]);
  const handleDeleteClick = useFlatClick(deleteFilter);

  const setAsDefault = useCallback(() => {
    dispatch(setDefaultCustomFilter(name));
  }, [dispatch, name]);
  const handleSetDefault = useFlatClick(setAsDefault);

  return (
    <div className="pr2 mt3">
      <StyledFlex>
        {name !== 'event.kind' && (
          <IconSpacerPointer
            as="span"
            {...handleDeleteClick}
            spaceLeft
            spaceRight
          >
            <XIcon className="red" aria-label="Supprimer" />
          </IconSpacerPointer>
        )}
        <pre className="ma0">
          <StyledCode>{name}</StyledCode>:{' '}
          <StyledCode>{kinds.join(' | ')}</StyledCode>
        </pre>{' '}
        <button {...handleSetDefault}>✔ select</button>
      </StyledFlex>
      <CustomFilterContent>
        {map(values, (state, kind) => (
          <CustomFilterElement
            key={kind}
            kind={kind}
            state={state}
            parent={name}
          />
        ))}
      </CustomFilterContent>
    </div>
  );
};
