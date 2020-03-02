import React from 'react';
import styled from 'styled-components/macro';
import defaultActors from '../data/actors.json';
import { getEvents, Actor } from '../data/';
import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers/';
import _ from 'lodash';

import Mask from '../feature/mask/Mask';

const events = _.flatMap((defaultActors as any) as Actor[], getEvents);

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    events
  }
});

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
  return (
    <Provider store={store}>
      <Main>
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
    </Provider>
  );
}

export default App;
