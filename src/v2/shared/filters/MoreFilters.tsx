import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { ChevronDownIcon, FilterIcon, XIcon } from '@primer/octicons-react';
import { map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { scrollbar } from '../../../components/scrollbar';
import CheckBoxSwitch from '../../../components/ui/CheckBoxSwitch';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { useDimsPopper } from '../../../components/ui/Popper';
import { SmallFont } from '../../../feature/mask/styled-components';
import Modal from '../../../feature/modal/Modal';
import { stopEventPropagation, useFlatClick } from '../../../hooks/useClick';
import { darkgray, lightgray, moongray } from '../../components/theme';
import {
  removeCustomFilter,
  toggleCustomFilter,
} from '../../reducers/mask/customFilterSlice';
import {
  selectCustomFilters,
  selectUsedCustomFilters,
} from '../../selectors/mask/customFilter';
import { addCustomFilterThunk } from '../../thunks/customFilterThunk';

const Container = styled.span`
  align-self: end;
`;

const MoreFiltersButton = styled.button`
  line-height: 0;
  border: 1px solid ${darkgray};
  border-radius: 4px;
  position: relative;
  padding: 2px;
`;

const OffsetBottomLeft = styled(ChevronDownIcon)`
  position: absolute;
  left: 0;
  bottom: 0;
`;

const AbsoluteDiv = styled.div`
  top: 0;
  z-index: 9999;
  width: 50%;
  max-height: 50%;
  padding: 0.25em;
  position: absolute;
  background-color: white;
  box-shadow: 1px 1px 5px 0 ${darkgray};
  border-radius: 3px;
  pointer-events: auto;
  overflow-y: auto;
  ${scrollbar}
`;

const CustomFiltersInput: React.FC = function () {
  const dispatch = useDispatch();

  const [input, setInput] = useState('');

  const handleInput = useCallback((e: FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input) dispatch(addCustomFilterThunk(input));
      setInput('');
    },
    [input, dispatch]
  );

  return (
    <form onSubmit={handleSubmit} onMouseUpCapture={stopEventPropagation}>
      <input
        type="text"
        name="add-filter"
        id="add-filter"
        placeholder="add filter"
        aria-label="add filter"
        value={input}
        onInput={handleInput}
      />
      <button type="submit" disabled={input.trim() === ''}>
        ✔
      </button>
    </form>
  );
};

export const MoreFilters: React.FC = function () {
  const $ref = useRef<HTMLButtonElement>(null as any);
  const $content = useRef<HTMLDivElement>(null as any);
  const [dims, show, hide] = useDimsPopper($ref, $content, 'south-west-right');

  const [toggle, setToggle] = useState(true);

  const toggler = useCallback(() => {
    if (toggle) {
      show();
      setToggle(false);
    } else {
      hide();
      setToggle(true);
    }
  }, [toggle, show, hide]);

  const flatClick = useFlatClick(toggler);

  const filters = useSelector(selectCustomFilters);
  const usedFilters = useSelector(selectUsedCustomFilters);

  return (
    <Container>
      <MoreFiltersButton ref={$ref} {...flatClick}>
        <FilterIcon size={16} />
        {usedFilters && <OffsetBottomLeft size={10} />}
      </MoreFiltersButton>
      <Modal>
        <AbsoluteDiv ref={$content} style={dims}>
          <CustomFiltersInput />
          <div>
            {map(filters, (values, filter) => (
              <SingleFilterView name={filter} filter={values} />
            ))}
          </div>
        </AbsoluteDiv>
      </Modal>
    </Container>
  );
};

const CustomFilter: React.FC<{
  kind: string;
  state: string | null;
  parent: string;
}> = function ({ kind, state, parent }) {
  const dispatch = useDispatch();

  const handleCheck = useCallback(() => {
    dispatch(toggleCustomFilter([parent, kind]));
  }, [dispatch, parent, kind]);

  return (
    <CheckBoxSwitch
      key={kind}
      checked={state !== null}
      handleCheck={handleCheck}
      color={darkgray}
    >
      <SmallFont>{kind}</SmallFont>
    </CheckBoxSwitch>
  );
};

const SingleFilterContent = styled(StyledFlex)`
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

export const SingleFilterView: React.FC<{
  name: string;
  filter: { kinds: string[]; values: _.Dictionary<string | null> };
}> = function ({ name, filter }) {
  const dispatch = useDispatch();
  const deleteFilter = useCallback(() => {
    dispatch(removeCustomFilter(name));
  }, [dispatch, name]);
  const handleDeleteClick = useFlatClick(deleteFilter);

  return (
    <div className="pr2 mt3">
      <StyledFlex>
        <IconSpacerPointer
          as="span"
          {...handleDeleteClick}
          spaceLeft
          spaceRight
        >
          <XIcon className="red" aria-label="Supprimer" />
        </IconSpacerPointer>
        <pre className="ma0">
          <StyledCode>{name}</StyledCode>:{' '}
          <StyledCode>{filter.kinds.join(' | ')}</StyledCode>
        </pre>
      </StyledFlex>
      <SingleFilterContent>
        {map(filter.values, (state, kind) => (
          <CustomFilter key={kind} kind={kind} state={state} parent={name} />
        ))}
      </SingleFilterContent>
    </div>
  );
};
