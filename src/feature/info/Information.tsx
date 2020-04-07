import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { Datation } from '../../data';
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

export function parseDates(dates: Datation[]) {
  return _(dates)
    .map((date) => date.value)
    .join(' - ');
}

const selectInformationEvents = createSelector(
  selectEvents,
  selectionAsMap,
  maskedEventsAsMap,
  superHighlightAsMap,
  function (events, selected, masked, highlighted) {
    return _<SelectedEvent>(events)
      .chain()
      .map<SelectedEvent>((e) => ({
        ...e,
        highlighted: highlighted[e.id] !== undefined,
        selected: selected[e.id] !== undefined,
        masked: masked[e.id] === undefined,
      }))
      .orderBy(['datation[0].clean_date'])
      .value();
  }
);

export const Information: React.FC<{ className?: string }> = function ({
  className,
}) {
  const selectedEvents = useSelector(selectInformationEvents);

  const groups = useGroups(selectedEvents);

  return (
    <Flex column className={classnames('pa1 h-100 overflow-y-auto', className)}>
      {_.map(groups.no, (g) => (
        <InformationFold key={g.group.uri} {...g} />
      ))}
      <hr />
      {/* TODO  style */}
      {_.map(groups.yes, (g) => (
        <MaskedInformation key={g.group.uri} {...g} />
      ))}
    </Flex>
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

//* TODO : autovis clustering
//* pacific vis van wijk
