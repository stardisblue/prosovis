import React from 'react';
import defaultActors from '../data/actors.json';
import {
  useSiprojurisContext,
  SiprojurisContext
} from '../context/SiprojurisContext';
import SiprojurisTimeline from '../feature/timeline/SiprojurisTimeline';
import Information from '../feature/info/Information';
import { Flex } from '../components/ui/Flex';
import { useColorContext, ColorContext } from '../context/ColorContext';
import SiprojurisMap from '../feature/map/SiprojurisMap';
import Relation from '../feature/relation/Relation';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers/';

const store = configureStore({ reducer: rootReducer });

function App() {
  const value = useSiprojurisContext(defaultActors as any);
  const colorContext = useColorContext();
  return (
    <Provider store={store}>
      <ColorContext.Provider value={colorContext}>
        <SiprojurisContext.Provider value={value}>
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
        </SiprojurisContext.Provider>
      </ColorContext.Provider>
    </Provider>
  );
}

export default App;
