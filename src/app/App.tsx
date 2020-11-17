import React, { useMemo, useCallback, useRef } from 'react';
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
import { HelpInfoBubble } from '../feature/help/InfoButton';
import { OfflineBanner } from '../feature/check-server/OfflineBanner';
import GlobalView from '../v2/global/GlobalView';
import Side1Main3 from '../v2/components/ui/Side1Main3';
import GridAutoRest from '../v2/components/ui/GridAutoRest';
import Flip from '../v2/components/ui/Flip';
import theme from '../v2/components/theme';

const Main = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'rel  map'
    'timeline timeline';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
`;

const StyledMap = styled(SiprojurisMap)`
  grid-area: map;
  border-left: 1px solid ${theme.lightgray};
`;

const StyledRelation = styled(Relation)`
  grid-area: rel;
  border-top: 1px solid ${theme.lightgray};
`;

const StyledTimeline = styled(SiprojurisTimeline)`
  grid-area: timeline;
`;

const Header = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr auto;
`;

const StyledInfoBubble = styled(HelpInfoBubble)`
  padding: 2px;
`;

function App() {
  const $ref = useRef<HTMLDivElement>(null as any);

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
    <div ref={$ref} {...bind}>
      <Side1Main3>
        <GridAutoRest>
          <Autocomplete />
          <Information />
        </GridAutoRest>
        <GridAutoRest>
          <Header>
            <Mask />
            <StyledInfoBubble />
          </Header>
          <Flip>
            <GlobalView />
            <Main>
              <StyledRelation />
              <StyledMap />
              <StyledTimeline />
            </Main>
          </Flip>
        </GridAutoRest>
      </Side1Main3>
      <ActorModal />
      <OfflineBanner />
    </div>
  );
}

export default App;
