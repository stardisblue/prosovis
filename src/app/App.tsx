import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components/macro';

import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { useDispatch } from 'react-redux';

import Mask from '../feature/mask/Mask';
import { useMouse } from '../feature/timeline/useMouse';
import { clearSelection } from '../reducers/selectionSlice';
import { ActorModal } from '../feature/modal/ActorModal';
import Autocomplete from '../feature/search/Autocomplete';

const Main = styled.main`
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas:
    'search mask mask'
    'info mask mask'
    'info rel map'
    'info timeline timeline';
  grid-template-columns: 25% 1fr 1fr;
  grid-template-rows: auto auto 1fr auto;
`;

const Search = styled.section`
  grid-area: search;
`;

const StyledInformation = styled(Information)`
  grid-area: info;
`;

const StyledMap = styled(SiprojurisMap)`
  grid-area: map;
`;

const StyledRelation = styled(Relation)`
  grid-area: rel;
`;

const StyledTimeline = styled(SiprojurisTimeline)`
  grid-area: timeline;
`;

function App() {
  const dispatch = useDispatch();
  const onClick = useCallback((e) => {
    dispatch(clearSelection());
    // safely ignoring dispatch
    //eslint-disable-next-line
  }, []);
  const mouse = useMouse();

  const bind = useMemo<
    {
      [key in
        | 'onMouseDown'
        | 'onMouseMove'
        | 'onMouseUp']: React.MouseEventHandler;
    }
  >(
    () => ({
      onMouseDown: (e) => {
        if (!mouse.current.click) {
          mouse.current.click = true;
          mouse.current.x = e.pageX;
          mouse.current.y = e.pageY;
        }
      },
      onMouseMove: (e) => {
        if (
          mouse.current.click &&
          mouse.current.draggingTreshold(mouse.current, e)
        ) {
          mouse.current.dragging = true;
          mouse.current.click = false;
        }
      },
      onMouseUp: (e) => {
        if (mouse.current.click) onClick(e);
        mouse.current.dragging = false;
        mouse.current.click = false;
      },
    }),
    // safely ignore onClick and mouse, onclick never changes and mouse is a reference
    // eslint-disable-next-line
    []
  );
  return (
    <>
      <Main {...bind}>
        <Mask />
        <Search>
          <Autocomplete />
        </Search>
        <StyledInformation />
        <StyledRelation />
        <StyledMap />
        <StyledTimeline />
      </Main>
      <ActorModal />
    </>
  );
}

export default App;
