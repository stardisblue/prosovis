import React from 'react';
import styled from 'styled-components/macro';
import SiprojurisMap from '../../feature/map/SiprojurisMap';
import Relation from '../../feature/relation/Relation';
import SiprojurisTimeline from '../../feature/timeline/SiprojurisTimeline';
import { lightgray } from '../components/theme';

const Main = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'rel  map'
    'timeline timeline';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
`;

const StyledMap = styled(SiprojurisMap)`
  grid-area: map;
  border-left: 1px solid ${lightgray};
`;

const StyledRelation = styled(Relation)`
  grid-area: rel;
  border-top: 1px solid ${lightgray};
`;

const StyledTimeline = styled(SiprojurisTimeline)`
  grid-area: timeline;
`;

export function DetailView() {
  return (
    <Main>
      <StyledRelation />
      <StyledMap />
      <StyledTimeline />
    </Main>
  );
}
