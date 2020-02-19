import React from 'react';
import _ from 'lodash';
import { Datation } from '../../data';
import { MemoInfoGroup } from './InfoGroup';
import { useGroups } from './useGroups';
import { SelectedEvent } from './models';
import { Flex } from '../../components/ui/Flex';
import { useSelector } from 'react-redux';
import { selectEvents } from '../../selectors/event';
import { maskedEventsAsMap } from '../../selectors/mask';
import { selectionAsMap } from '../../selectors/selection';
import { createSelector } from '@reduxjs/toolkit';

export function parseDates(dates: Datation[]) {
  return _(dates)
    .map(date => date.value)
    .join(' - ');
}

const selectInformationEvents = createSelector(
  selectEvents,
  selectionAsMap,
  maskedEventsAsMap,
  function(events, selected, masked) {
    return _<SelectedEvent>(events)
      .chain()
      .map<SelectedEvent>(e => ({
        ...e,
        selected: selected[e.id] !== undefined,
        filtered: masked[e.id] === undefined
      }))
      .orderBy(['datation[0].clean_date'])
      .value();
  }
);

export const Information: React.FC = function() {
  const selectedEvents = useSelector(selectInformationEvents);

  const groups = useGroups(selectedEvents);

  return (
    <div className="overflow-y-auto vh-100">
      <Flex column className="pa1 vh-100">
        {_.map(groups.no, g => (
          <MemoInfoGroup key={g.group.uri} {...g} />
        ))}
      </Flex>
    </div>
  );
};

export default Information;

// lors du click, pousser les autres déroulants en bas de l'ecran au lieu de les faire "disparaitre"
// mettre les miserables à droite
// filtre au brush,
// masque avec les boutons des event.kind
// info:selection: inactif si infoevent is gray
// - fermé par défaut
// info:carte: filtre = zoom fleches : séquence parmi les lieux affichés
// couleurs-cartes
// report: semaine derniere
