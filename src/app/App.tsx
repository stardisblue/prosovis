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

function App() {
  const value = useSiprojurisContext(defaultActors as any);

  return (
    <SiprojurisContext.Provider value={value}>
      <div className="cf vh-100">
        <div className="fl w-25 h-100 overflow-y-auto">
          <Information />
        </div>
        <div className="fl w-75 vh-100">
          {/* <div className="h-50"> <SiprojurisMap /> </div> */}
          <div className="h-50">
            <SiprojurisTimeline />
          </div>
        </div>
      </div>
    </SiprojurisContext.Provider>
  );
}

export default App;
