import React from 'react';
import defaultActors from '../data/actors.json';
import {
  useSiprojurisContext,
  SiprojurisContext
} from '../context/SiprojurisContext';
import { SiprojurisTimeline } from '../feature/timeline/SiprojurisTimeline';
import { Information } from '../feature/info/Information';
import { Flex } from '../components/ui/Flex';
import { useColorContext, ColorContext } from '../context/ColorContext';

function App() {
  const value = useSiprojurisContext(defaultActors as any);
  const colorContext = useColorContext();
  return (
    <ColorContext.Provider value={colorContext}>
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
      </SiprojurisContext.Provider>
    </ColorContext.Provider>
  );
}

export default App;
