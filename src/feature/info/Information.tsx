import React from 'react';
import classnames from 'classnames';
import { Datation } from '../../data/typings';
import { InformationFold } from './fold/InformationFold';
import { useGroups } from './useGroups';
import { SelectedEvent } from './models';
import { Flex } from '../../components/ui/Flex';
import { selectEvents } from '../../selectors/event';
import { maskedEventsAsMap } from '../../selectors/mask';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { selectionAsMap } from '../../selectors/selection';
import MaskedInformation from './MaskedInformation';
import { superHighlightAsMap } from '../../selectors/superHighlights';
import { flow, map, get, join, sortBy } from 'lodash/fp';
import { ActorNote } from './fold/ActorNote';
import { SiprojurisEvent } from '../../data/sip-typings';

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
    <Flex column className={classnames('pa1 h-100 overflow-y-auto', className)}>
      {map(
        (g) =>
          g.kind === 'Actor' ? (
            <ActorNote key={g.group.uri} {...g} />
          ) : (
            <InformationFold key={g.group.uri} {...g} />
          ),
        groups.no
      )}
      <hr />
      {/* TODO  style */}
      {map(
        (g) => (
          <MaskedInformation key={g.group.uri} {...g} />
        ),
        groups.yes
      )}
    </Flex>
  );
};

export default Information;

//* TODO : autovis clustering
//* pacific vis van wijk
