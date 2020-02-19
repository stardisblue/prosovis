import React from 'react';
import defaultActors from '../data/actors.json';
import { getEvents, Actor, AnyEvent } from '../data/';
import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import { Flex } from '../components/ui/Flex';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers/';
import _ from 'lodash';

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
    },
    color: {
      domain: [
        'PassageExamen',
        'Birth',
        'Education',
        'Retirement',
        'SuspensionActivity',
        'Death',
        'ObtainQualification'
      ],
      range: [
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f'
      ]
    }
  }
});

function App() {
  return (
    <Provider store={store}>
      <Flex>
        <div className="w-25">
          <Information />
        </div>
        <Flex column className="w-75">
          <Flex col>
            <div className="w-100 h-100">
              <Relation />
            </div>
            <SiprojurisMap />
          </Flex>
          <div>
            <SiprojurisTimeline />
          </div>
        </Flex>
      </Flex>
    </Provider>
  );
}

export default App;
