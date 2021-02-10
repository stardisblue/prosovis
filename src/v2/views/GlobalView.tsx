import React from 'react';
import styled from 'styled-components/macro';
import GlobalMap from '../global/map/GlobalMap';
import GlobalTimeline from '../global/timeline/GlobalTimeline';
import GlobalGraph from '../global/graph/GlobalGraph';
import { lightgray } from '../../components/ui/colors';
import useMount from '../../hooks/useMount';
import { useDispatch } from 'react-redux';
import { fetchLocalisations } from '../reducers/localisationsDataSlice';
import { fetchActors } from '../reducers/actorsDataSlice';
import { fetchEvents } from '../reducers/eventsDataSlice';
import { fetchGraph } from '../reducers/graphDataSlice';
import { fetchRelations } from '../reducers/relationsDataSlice';

export const StyledGlobalView = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'rel  map'
    'timeline timeline';
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: 1fr 250px;
`;

const GraphArea = styled.div`
  grid-area: rel;
`;

const MapArea = styled.div`
  grid-area: map;
  border-left: 1px solid ${lightgray};
`;
const TimelineArea = styled.div`
  grid-area: timeline;
  border-top: 1px solid ${lightgray};
`;

const GlobalView: React.FC = function () {
  const dispatch = useDispatch();
  useMount(() => {
    dispatch(fetchLocalisations());
    dispatch(fetchActors());
    dispatch(fetchEvents());
    dispatch(fetchGraph());
    dispatch(fetchRelations());
  });
  return (
    <StyledGlobalView>
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
