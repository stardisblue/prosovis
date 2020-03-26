import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import Mask from '../feature/mask/Mask';
import { useFlatClick } from '../hooks/useClick';
import { useMouse } from '../feature/timeline/useMouse';
import { clearSelection } from '../reducers/selectionSlice';

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

const StyledTimeline = styled(SiprojurisTimeline)`
  grid-area: timeline;
`;

function App() {
  const mouse = useMouse();
  const dispatch = useDispatch();
  const { onClick } = useFlatClick(e => {
    dispatch(clearSelection());
  });
  const bind = useMemo<
    {
      [key in
        | 'onMouseDown'
        | 'onMouseMove'
        | 'onMouseUp']: React.MouseEventHandler;
    }
  >(
    () => ({
      onMouseDown: e => {
        if (!mouse.current.click) {
          mouse.current.click = true;
          mouse.current.x = e.pageX;
          mouse.current.y = e.pageY;
        }
      },
      onMouseMove: e => {
        if (
          mouse.current.click &&
          mouse.current.draggingTreshold(mouse.current, e)
        ) {
          mouse.current.dragging = true;
          mouse.current.click = false;
        }
      },
      onMouseUp: e => {
        if (mouse.current.click) onClick(e);
        mouse.current.dragging = false;
        mouse.current.click = false;
      }
    }),
    []
  );
  return (
    <Main {...bind}>
      <Mask />
      <Search>
        <input type="text" name="" id="" placeholder="Rechercher un acteur" />
      </Search>
      <StyledInformation />
      <div style={{ gridArea: 'rel' }}>
        <Relation />
      </div>
      <StyledMap />
      <StyledTimeline />
    </Main>
  );
}

export default App;
