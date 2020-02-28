import React from 'react';
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
import KindList from '../feature/mask/KindList';
import ActorList from '../feature/mask/ActorList';
import ColorSwitch from '../feature/mask/ColorSwitch';

const events = _.flatMap((defaultActors as any) as Actor[], getEvents);

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    events
  }
});

function App() {
  return (
    <Provider store={store}>
      <main
        style={{
          display: 'grid',
          width: '100%',
          height: '100vh',
          gridTemplateAreas:
            '"search mask mask" "info mask mask" "info rel map" "info timeline timeline"',
          gridTemplateColumns: '25% 1fr 1fr',
          gridTemplateRows: 'auto auto 1fr auto'
        }}
      >
        <div style={{ gridArea: 'mask' }}>
          <ColorSwitch />
          <ActorList />
          <KindList />
        </div>

        <div style={{ gridArea: 'search' }}>
          <input type="text" name="" id="" placeholder="Rechercher un acteur" />
        </div>
        <div style={{ gridArea: 'info' }}>
          <Information />
        </div>
        <div style={{ gridArea: 'rel' }}>
          <Relation />
        </div>
        <div style={{ gridArea: 'map' }}>
          <SiprojurisMap />
        </div>
        <div style={{ gridArea: 'timeline' }}>
          <SiprojurisTimeline />
        </div>
      </main>
    </Provider>
  );
}

export default App;
