import React, { useContext, useMemo } from 'react';
import _ from 'lodash';
import { Datation, AnyEvent } from '../../data';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import { MemoInfoGroup } from './InfoGroup';
import { useGroups } from './useGroups';
import { SelectedAnyEvent } from './models';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .map(date => date.value)
    .join(' - ');
}

export const Information: React.FC = function() {
  const siprojuris = useContext(SiprojurisContext);
  const { selected, filteredEvents } = siprojuris;

  const selectedEvents = useMemo(() => {
    let loEvents = _<SelectedAnyEvent>(filteredEvents);

    if (selected) {
      loEvents = loEvents.map<SelectedAnyEvent>(e => ({
        ...e,
        selected: _.sortedIndexOf(selected, e.id) !== -1
      }));
    }

    return loEvents.orderBy(['datation[0].clean_date']).value();
  }, [selected, filteredEvents]);

  const groups = useGroups(selectedEvents);

  return (
    <div>
      {_.map(groups, ({ key, events, selected }) => (
        <MemoInfoGroup
          key={key.uri}
          group={key}
          events={events}
          selected={selected}
        />
      ))}
    </div>
  );
};
