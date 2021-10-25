import { map } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { scrollbar } from '../../../components/scrollbar';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { SmallFont } from '../../../feature/mask/styled-components';
import { selectSwitchMainColor } from '../../../selectors/switch';
import Loading from '../../components/Loading';
import { moongray } from '../../components/theme';
import { selectEvents } from '../../selectors/events';
import { selectDefaultCustomFilter } from '../../selectors/mask/customFilter';
import { addCustomFilterThunk } from '../../thunks/customFilterThunk';
import { CustomFilterElement } from './CustomFilterElement';
import { DropDownCustomFilters } from './DropDownCustomFilters';

const StyledCode = styled.code`
  background-color: ${moongray};
  border-radius: 4px;
  padding-left: 0.125em;
  padding-right: 0.125em;
  margin-right: 0.25em;
`;

const Gridy = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const ScrollableFlex = styled(StyledFlex)`
  overflow-y: hidden;
  overflow-x: auto;
  ${scrollbar}
`;

export const CustomFilters: React.FC = function () {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);

  useEffect(() => {
    if (events) {
      dispatch(addCustomFilterThunk({ selected: true, filter: 'event.kind' }));
    }
  }, [events, dispatch]);

  const selected = useSelector(selectDefaultCustomFilter);
  const color = useSelector(selectSwitchMainColor);

  return (
    <Loading finished={selected} size={1}>
      <Gridy>
        <ScrollableFlex>
          <SmallFont as={'div'} style={{ alignSelf: 'center' }}>
            <StyledCode>
              <i>{selected?.name}</i>
            </StyledCode>
          </SmallFont>
          {
            selected &&
              map(selected.values, (state, kind) => (
                <CustomFilterElement
                  key={kind}
                  kind={kind}
                  state={state}
                  parent={selected.name}
                  color={color}
                  hideNumber
                />
              ))
            // map(
            //   (kind) => <Kind key={kind.value} kind={kind.value!} />,
            //   selected?.values
            // )
          }
        </ScrollableFlex>
        <DropDownCustomFilters />
      </Gridy>
    </Loading>
  );
};
