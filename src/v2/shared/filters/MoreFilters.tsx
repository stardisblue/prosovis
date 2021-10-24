import React, { useCallback, useRef, useState } from 'react';

import { ChevronDownIcon, FilterIcon } from '@primer/octicons-react';
import styled from 'styled-components/macro';
import { darkgray } from '../../components/theme';
import Modal from '../../../feature/modal/Modal';
import { useDimsPopper } from '../../../components/ui/Popper';
import { useFlatClick } from '../../../hooks/useClick';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash/fp';

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
  padding: 0.25em;
  position: absolute;
  background-color: white;
  box-shadow: 1px 1px 5px 0 ${darkgray};
  border-radius: 3px;
  pointer-events: auto;
`;

const selectFilters = () => [];

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

  const filters = useSelector(selectFilters);

  return (
    <Container>
      <MoreFiltersButton ref={$ref} {...flatClick}>
        <FilterIcon size={16} />
        {!isEmpty(filters.length) && <OffsetBottomLeft size={10} />}
      </MoreFiltersButton>
      <Modal>
        <AbsoluteDiv ref={$content} style={dims}>
          <form>
            <input
              type="text"
              name="add-filter"
              id="add-filter"
              placeholder="add filter"
              aria-label="add filter"
            />
            <button type="submit"></button>
          </form>
        </AbsoluteDiv>
      </Modal>
    </Container>
  );
};
