import React, { useCallback, useRef, useState } from 'react';
import { ChevronDownIcon, FilterIcon } from '@primer/octicons-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { scrollbar } from '../../../components/scrollbar';
import { useDimsPopper } from '../../../components/ui/Popper';
import Modal from '../../../feature/modal/Modal';
import { useFlatClick } from '../../../hooks/useClick';
import { darkgray } from '../../components/theme';
import {
  selectRestCustomFilters,
  selectUsedCustomFilters,
} from '../../selectors/mask/customFilter';
import { CustomFiltersInput } from './CustomFiltersInput';
import { SingleFilterView } from './SingleFilterView';
import { map } from 'lodash/fp';

export const Container = styled.span`
  align-self: end;
`;

export const MoreFiltersButton = styled.button`
  line-height: 0;
  border: 1px solid ${darkgray};
  border-radius: 4px;
  position: relative;
  padding: 2px;
`;

export const OffsetBottomLeft = styled(ChevronDownIcon)`
  position: absolute;
  left: 0;
  bottom: 0;
`;

export const AbsoluteDiv = styled.div`
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

export const DropDownCustomFilters: React.FC = function () {
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

  const filters = useSelector(selectRestCustomFilters);
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
            {map(
              (values) => (
                <SingleFilterView key={values.name} {...values} />
              ),
              filters
            )}
          </div>
        </AbsoluteDiv>
      </Modal>
    </Container>
  );
};
