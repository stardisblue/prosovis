import React from 'react';
import styled from 'styled-components/macro';
import ColorSwitch from './ColorSwitch';
import ActorList from './ActorList';
import KindList from './KindList';

const StyledSection = styled.section`
  grid-area: mask;
  display: grid;
  grid-template:
    'switches actors' auto
    'switches kinds' auto / auto 1fr;
  padding-top: 0.125em;
  padding-right: 0.125em;
  padding-bottom: 0.125em;
  padding-left: 0.25em;
`;

const SwitchArea = styled.div`
  grid-area: switches;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
`;

const ActorsArea = styled.div`
  grid-area: actors;
`;

const KindsArea = styled.div`
  grid-area: kinds;
`;

const Mask: React.FC = function() {
  return (
    <StyledSection>
      <SwitchArea>
        <ColorSwitch />
      </SwitchArea>
      <ActorsArea>
        <ActorList />
      </ActorsArea>
      <KindsArea>
        <KindList />
      </KindsArea>
    </StyledSection>
  );
};

export default Mask;
