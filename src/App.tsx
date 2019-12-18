import React from 'react';
import './App.css';
import defaultActors from './store/actors.json';
import { useSiprojurisContext, SiprojurisContext } from './SiprojurisContext';
import { SiprojurisTimeline } from './components/SiprojurisTimeline';
import { SiprojurisInformation } from './components/SiprojurisInformation';

function App() {
  const value = useSiprojurisContext(defaultActors as any);

  return (
    <SiprojurisContext.Provider value={value}>
      <div className="cf vh-100">
        <div className="fl w-25 h-100 overflow-y-auto">
          <SiprojurisInformation />
        </div>
        <div className="fl w-75 vh-100">
          {/* <div className="h-50"><SiprojurisMap /></div> */}
          <div className="h-50">
            <SiprojurisTimeline />
          </div>
        </div>
      </div>
    </SiprojurisContext.Provider>
  );
}

export default App;
