import React from 'react';
import styled from 'styled-components/macro';
import ColorSwitch from './ColorSwitch';
import ActorList from './ActorList';
import { KindMaskView } from '../../v2/views/KindMaskView';

const StyledSection = styled.section`
  display: grid;
  grid-template:
    'switches actors' auto
    'switches kinds' auto / auto 1fr;
  grid-row-gap: 0.125em;
  padding-top: 0.125em;
  padding-right: 0.125em;
  padding-bottom: 0.125em;
  padding-left: 0.25em;
`;

const SwitchArea = styled.div`
  grid-area: switches;
  /* padding-top: 0.25em; */
  /* padding-bottom: 0.25em; */
`;

const ActorsArea = styled.div`
  grid-area: actors;
  min-height: 1.25em;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

const KindsArea = styled.div`
  grid-area: kinds;
  min-height: 1.25em;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

const Mask: React.FC<{ className?: string }> = function ({ className }) {
  return (
    <StyledSection className={className}>
      <SwitchArea>
        <ColorSwitch />
      </SwitchArea>
      <ActorsArea>
        <ActorList />
      </ActorsArea>
      <KindsArea>
        <KindMaskView />
      </KindsArea>
    </StyledSection>
  );
};

export default Mask;
