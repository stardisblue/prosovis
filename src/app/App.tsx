import React from 'react';
import './App.css';
import defaultActors from '../data/actors.json';
import {
  useSiprojurisContext,
  SiprojurisContext
} from '../context/SiprojurisContext';
import { SiprojurisTimeline } from '../feature/timeline/SiprojurisTimeline';
import { Information } from '../feature/info/Information';
// import { SiprojurisMap } from '../feature/map/SiprojurisMap';
import { Flex } from '../components/ui/Flex';

function App() {
  const value = useSiprojurisContext(defaultActors as any);

  return (
    <SiprojurisContext.Provider value={value}>
      <Flex>
        <div className="w-25">
          <Information />
        </div>
        <div className="w-75">
          {/* <div className="h-50"> <SiprojurisMap /> </div> */}
          <SiprojurisTimeline />
        </div>
      </Flex>
      <div className="cf vh-100"></div>
    </SiprojurisContext.Provider>
  );
}

export default App;
