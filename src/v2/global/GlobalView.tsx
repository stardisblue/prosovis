import React from 'react';
import styled from 'styled-components/macro';
import GlobalMap from './map/GlobalMap';
import GlobalTimeline from './timeline/GlobalTimeline';
import GlobalGraph from './graph/GlobalGraph';
import { lightgray } from '../../components/ui/colors';
import useMount from '../../hooks/useMount';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalisations } from '../reducers/localisationsDataSlice';
import { fetchActors } from '../reducers/actorsDataSlice';
import { fetchEvents } from '../reducers/eventsDataSlice';
import { fetchGraph } from '../reducers/graphDataSlice';
import { selectAllKinds } from '../selectors/events';
import { selectGlobalKindMask } from '../selectors/globalKindMask';
import { map } from 'lodash/fp';
import CheckBoxSwitch from '../../components/ui/CheckBoxSwitch';
import theme from '../components/theme';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { toggleKindMask } from '../reducers/globalKindMaskSlice';
import Loading from '../components/Loading';
import { selectMainColor } from '../../selectors/color';

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
  grid-template-rows: auto 1fr 250px;
`;

const GraphArea = styled.div`
  grid-area: rel;
  border-top: 1px solid ${lightgray};
`;

const HeaderArea = styled.div`
  grid-area: header;
  height: 2em;
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
        <GlobalKindMask />
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

export const GlobalKindMask: React.FC = function () {
  const kinds = useSelector(selectAllKinds);
  const mask = useSelector(selectGlobalKindMask);
  const color = useSelector(selectMainColor);

  const dispatch = useDispatch();
  return (
    <Loading finished={kinds} size={1.5}>
      <StyledFlex>
        {map(
          (kind) => (
            <CheckBoxSwitch
              checked={mask[kind] === undefined}
              handleCheck={() => {
                dispatch(toggleKindMask(kind));
              }}
              color={color(kind)}
            >
              {kind}
            </CheckBoxSwitch>
          ),
          kinds
        )}
      </StyledFlex>
    </Loading>
  );
};

export default GlobalView;
