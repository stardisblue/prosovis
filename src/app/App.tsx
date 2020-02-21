import React from 'react';
import defaultActors from '../data/actors.json';
import { getEvents, Actor, AnyEvent } from '../data/';
import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers/';
import _ from 'lodash';
import KindList from '../feature/kind/KindList';

const events = _.flatMap((defaultActors as any) as Actor[], getEvents);

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    events,
    mask: {
      kind: _(events)
        .uniqBy('kind')
        .map<[AnyEvent['kind'], boolean]>(k => [k.kind, true])
        .fromPairs()
        .value() as { [k in AnyEvent['kind']]: boolean }
    }
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
            '"header header header" "info rel map" "info timeline timeline"',
          gridTemplateColumns: '25% 1fr 1fr',
          gridTemplateRows: 'auto 1fr auto'
        }}
      >
        <div style={{ gridArea: 'header' }}>
          <KindList />
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
