import { flow, get, join, map, size } from 'lodash/fp';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { scrollbar } from '../../../components/scrollbar';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { ActorNote } from '../../../feature/info/fold/ActorNote';
import {
  DisabledActorNote,
  DisabledPlaceNote,
} from '../../../feature/info/fold/DisabledNote';
import { PlaceNote } from '../../../feature/info/fold/PlaceNote';
import { ProsoVisDate } from '../../types/events';
import { selectInformationGroups } from './useGroups';

export function parseDates(dates: ProsoVisDate[]) {
  return flow(map(get('value')), join(' - '))(dates);
}

export const Information: React.FC<{ className?: string }> = function ({
  className,
}) {
  const events = useSelector(selectInformationGroups);

  return (
    <Base className={className}>
      {map(
        (g) =>
          g.kind === 'ActorNote' ? (
            <ActorNote key={g.group.uri} {...g} />
          ) : (
            <PlaceNote key={g.group.uri} {...g} />
          ),
        events.no
      )}
      {size(events.yes) > 0 && <hr />}
      {/* TODO  style */}
      {map(
        (g) =>
          g.kind === 'ActorNote' ? (
            <DisabledActorNote key={g.group.uri} {...g} />
          ) : (
            <DisabledPlaceNote key={g.group.uri} {...g} />
          ),
        events.yes
      )}
    </Base>
  );
};

export const Base = styled(StyledFlex)`
  flex-direction: column;
  padding: 0.125em;
  height: 100%;
  overflow-y: auto;
  ${scrollbar}
`;

export default Information;
