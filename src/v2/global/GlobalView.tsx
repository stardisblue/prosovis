import React from 'react';
import styled from 'styled-components/macro';
import GlobalMap from './map/GlobalMap';
import GlobalTimeline from './timeline/GlobalTimeline';
import GlobalGraph from './graph/GlobalGraph';
import { lightgray } from '../../components/ui/colors';
import useMount from '../../hooks/useMount';
import { useDispatch } from 'react-redux';
import { fetchLocalisations } from '../reducers/localisationsDataSlice';
import { fetchActors } from '../reducers/actorsDataSlice';
import { fetchEvents } from '../reducers/eventsDataSlice';
import { fetchGraph } from '../reducers/graphDataSlice';

export const StyledGlobalView = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header header'
    'rel  map'
    'timeline timeline';
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: auto 1fr auto;
`;

const GraphArea = styled.div`
  grid-area: rel;
  border-top: 1px solid ${lightgray};
`;

const HeaderArea = styled.div`
  grid-area: header;
`;

const MapArea = styled.div`
  grid-area: map;
  border-left: 1px solid ${lightgray};
`;
const TimelineArea = styled.div`
  grid-area: timeline;
`;

const GlobalView: React.FC = function () {
  const dispatch = useDispatch();
  useMount(() => {
    dispatch(fetchLocalisations());
    dispatch(fetchActors());
    dispatch(fetchEvents());
    dispatch(fetchGraph());
  });
  return (
    <StyledGlobalView>
      <HeaderArea>
        <h2>Vue d'ensemble</h2>
      </HeaderArea>
      <GraphArea>
        <GlobalGraph />
      </GraphArea>
      <MapArea>
        <GlobalMap />
      </MapArea>
      <TimelineArea>
        <GlobalTimeline />
      </TimelineArea>
    </StyledGlobalView>
  );
};

export default GlobalView;
