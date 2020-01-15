import React, { useContext, useMemo } from 'react';
import _ from 'lodash';
import { Datation } from '../../data';
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
  const { selected, events, filteredEvents } = siprojuris;

  const filtered = useMemo(() => {
    return _(filteredEvents)
      .map('id')
      .sort()
      .value();
  }, [filteredEvents]);

  const selectedEvents = useMemo(() => {
    return _<SelectedAnyEvent>(events)
      .chain()
      .map<SelectedAnyEvent>(e => ({
        ...e,
        selected: _.sortedIndexOf(selected, e.id) !== -1,
        filtered: _.sortedIndexOf(filtered, e.id) === -1
      }))
      .orderBy(['datation[0].clean_date'])
      .value();
  }, [selected, events, filtered]);

  const groups = useGroups(selectedEvents);

  return useMemo(
    () => (
      <div id="sipi" className="pa1">
        <div id="sipi--enabled" className="pb1">
          {_.map(groups.no, ({ key, events, selected, filtered }) => (
            <MemoInfoGroup
              key={key.uri}
              group={key}
              events={events}
              selected={selected}
              filtered={filtered}
            />
          ))}
        </div>
        <div id="sipi--disabled">
          {_.map(groups.yes, ({ key, events, selected, filtered }) => (
            <MemoInfoGroup
              key={key.uri}
              group={key}
              events={events}
              selected={selected}
              filtered={filtered}
            />
          ))}
        </div>
      </div>
    ),
    [groups]
  );
};
