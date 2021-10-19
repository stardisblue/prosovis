import React, { useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components/macro';
// import Information from '../feature/info/Information';
import { useDispatch } from 'react-redux';
import Mask from '../feature/mask/Mask';
import { useMouse } from '../feature/timeline/useMouse';
import { clearSelection } from '../reducers/selectionSlice';
import { ActorModal } from '../feature/modal/ActorModal';
import Autocomplete from '../feature/search/Autocomplete';
import { HelpInfoBubble } from '../feature/help/InfoButton';
import GlobalView from '../v2/views/GlobalView';
import Side1Main3 from '../v2/components/ui/Side1Main3';
import GridAutoRest from '../v2/components/ui/GridAutoRest';
import Flip from '../v2/components/ui/Flip';
import { lightgray } from '../v2/components/theme';
import { DetailView } from '../v2/views/DetailView';
import { resetGlobalSelection } from '../v2/reducers/global/selectionSlice';
import { resetActorSummary } from '../v2/reducers/global/actorSummarySlice';
import Information from '../v2/detail/information/Information';

const BorderedGridAutoRest = styled(GridAutoRest)`
  border-right: 1px solid ${lightgray};
`;

const Header = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr auto;
  border-bottom: 1px solid ${lightgray};
`;

const StyledInfoBubble = styled(HelpInfoBubble)`
  padding: 2px;
`;

function App() {
  const $ref = useRef<HTMLDivElement>(null as any);

  const dispatch = useDispatch();
  const onClick = useCallback(
    (e) => {
      dispatch(clearSelection());
      dispatch(resetGlobalSelection());
      dispatch(resetActorSummary());
    },
    [dispatch]
  );
  const mouse = useMouse();

  const bind = useMemo<{
    [key in
      | 'onMouseDown'
      | 'onMouseMove'
      | 'onMouseUp']: React.MouseEventHandler;
  }>(
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
        <BorderedGridAutoRest>
          <Autocomplete />
          <Information />
        </BorderedGridAutoRest>
        <GridAutoRest>
          <Header>
            <Mask />
            <StyledInfoBubble />
          </Header>
          <Flip>
            <GlobalView />
            <DetailView />
          </Flip>
        </GridAutoRest>
      </Side1Main3>
      <ActorModal />
    </div>
  );
}

export default App;
