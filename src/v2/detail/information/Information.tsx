import { flow, get, join, map, size } from 'lodash/fp';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { scrollbar } from '../../../components/scrollbar';
import { StyledFlex } from '../../../components/ui/Flex/styled-components';
import { ActorNote } from '../../../feature/info/fold/ActorNote';
import { DisabledNote } from '../../../feature/info/fold/DisabledNote';
import { PlaceNote } from '../../../feature/info/fold/PlaceNote';
import { ProsoVisActor } from '../../types/actors';
import { ProsoVisDate } from '../../types/events';
import { ProsoVisPlace } from '../../types/localisations';
import { InformationGroup, Interactive } from './types';
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
          g.group.kind === 'Actor' ? (
            <ActorNote
              key={g.group.uri}
              {...(g as Required<Interactive<InformationGroup<ProsoVisActor>>>)}
            />
          ) : (
            <PlaceNote
              key={g.group.uri}
              {...(g as Required<Interactive<InformationGroup<ProsoVisPlace>>>)}
            />
          ),
        events.no
      )}
      {size(events.yes) > 0 && <hr />}
      {/* TODO  style */}
      {map(
        (g) => (
          <DisabledNote
            key={g.group.uri}
            {...(g as Required<
              Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>
            >)}
          />
        ),
        events.yes
      )}
    </Base>
  );
  // const selectedEvents = useSelector(selectInformationEvents);

  // const groups = useGroups(selectedEvents);

  // return (
  //   <Base className={className}>
  //     {map(
  //       (g) =>
  //         g.kind === 'Actor' ? (
  //           <ActorNote key={g.group.uri} {...g} />
  //         ) : (
  //           <PlaceNote key={g.group.uri} {...g} />
  //         ),
  //       groups.no
  //     )}
  //     {size(groups.yes) > 0 && <hr />}
  //     {/* TODO  style */}
  //     {map(
  //       (g) => (
  //         <DisabledNote key={g.group.uri} {...g} />
  //       ),
  //       groups.yes
  //     )}
  //   </Base>
  // );
};

export const Base = styled(StyledFlex)`
  flex-direction: column;
  padding: 0.125em;
  height: 100%;
  overflow-y: auto;
  ${scrollbar}
`;

export default Information;
