import { createSelector } from '@reduxjs/toolkit';
import { flow, get, join, map, size, sortBy } from 'lodash/fp';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { StyledFlex } from '../../components/ui/Flex/styled-components';
import { SiprojurisEvent } from '../../data/sip-models';
import { Datation } from '../../data/models';
import { selectEvents } from '../../selectors/event';
import { maskedEventsAsMap } from '../../selectors/mask';
import { selectionAsMap } from '../../selectors/selection';
import { superHighlightAsMap } from '../../selectors/superHighlights';
import { ActorNote } from './fold/ActorNote';
import { DisabledNote } from './fold/DisabledNote';
import { PlaceNote } from './fold/PlaceNote';
import { SelectedEvent } from './models';
import { useGroups } from './useGroups';
import { scrollbar } from '../../components/scrollbar';

export function parseDates(dates: Datation[]) {
  return flow(map(get('value')), join(' - '))(dates);
}

const selectInformationEvents = createSelector(
  selectEvents,
  selectionAsMap,
  maskedEventsAsMap,
  superHighlightAsMap,
  function (events, selected, masked, highlighted) {
    return flow(
      map((e: SelectedEvent<SiprojurisEvent>) => ({
        ...e,
        highlighted: highlighted[e.id] !== undefined,
        selected: selected[e.id] !== undefined,
        masked: masked[e.id] === undefined,
      })),
      sortBy<SelectedEvent<SiprojurisEvent>>('datation[0].clean_date')
    )(events);
  }
);

export const Information: React.FC<{ className?: string }> = function ({
  className,
}) {
  const selectedEvents = useSelector(selectInformationEvents);

  const groups = useGroups(selectedEvents);

  return (
    <Base className={className}>
      {map(
        (g) =>
          g.kind === 'Actor' ? (
            <ActorNote key={g.group.uri} {...g} />
          ) : (
            <PlaceNote key={g.group.uri} {...g} />
          ),
        groups.no
      )}
      {size(groups.yes) > 0 && <hr />}
      {/* TODO  style */}
      {map(
        (g) => (
          <DisabledNote key={g.group.uri} {...g} />
        ),
        groups.yes
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

//* TODO : autovis clustering
//* pacific vis van wijk
