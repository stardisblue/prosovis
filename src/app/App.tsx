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
import { SiprojurisMap } from '../feature/map/SiprojurisMap';

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
          <Flex column className="w-75">
            <Flex col>
              <div className="w-100 h-100"></div>
              <SiprojurisMap />
            </Flex>
            <div>
              <SiprojurisTimeline />
            </div>
          </Flex>
        </Flex>
      </SiprojurisContext.Provider>
    </ColorContext.Provider>
  );
}

export default App;
