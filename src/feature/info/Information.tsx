import React, { useContext, useMemo } from 'react';
import _ from 'lodash';
import { Datation } from '../../data';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import { MemoInfoGroup } from './InfoGroup';
import { useGroups } from './useGroups';
import { SelectedEvent } from './models';
import { Flex } from '../../components/ui/Flex';

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
    return _<SelectedEvent>(events)
      .chain()
      .map<SelectedEvent>(e => ({
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
      <div className="overflow-y-auto  vh-100">
        <Flex column className="pa1 vh-100">
          {/* <div id="sipi--enabled"> */}
          {_.map(groups.no, g => (
            <MemoInfoGroup key={g.group.uri} {...g} />
          ))}
        </Flex>
        {/* </div> */}
        {groups.yes && [
          <hr className="w-100" />,
          // <div id="sipi--disabled">
          _.map(groups.yes, g => <MemoInfoGroup key={g.group.uri} {...g} />)
          // </div>
        ]}
      </div>
    ),
    [groups]
  );
};

// lors du click, pousser les autres déroulants en bas de l'ecran au lieu de les faire "disparaitre"
// mettre les miserables à droite
// filtre au brush,
// masque avec les boutons des event.kind
// info:selection: inactif si infoevent is gray
// - fermé par défaut
// info:carte: filtre = zoom fleches : séquence parmi les lieux affichés
// couleurs-cartes
// report: semaine derniere
