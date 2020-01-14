import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Ressource, AnyEvent } from '../../data';
import classnames from 'classnames';
import { SelectedAnyEvent } from './models';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Flex } from '../../components/Flex';

// TODO griser personnes
// surlingé : survol
// gras: selectionné
// normal: normal
// grisé: filtré
// TODO ajouter un espacement entre normal et grisé
//
// carte: meme granularité que la timeline filtres selections synchronisés
// mettre une personne floue
// TODO mettre surbrillance tout ce qui est personne selectionnée
// TODO mettre la date et l'evenement
// griser timeline lors du survol sur les autres visus

// V0 :
// Barre de recherche globale : lieu & acteur
// synchro timeline-carte-information
// laisser le graphe grisé
export const InfoGroup: React.FC<{
  group: Ressource;
  events: AnyEvent[];
  selected: boolean;
  filtered: boolean;
}> = function({ group, events, selected, filtered }) {
  const [show, setShow] = useState(selected === true);

  useEffect(() => setShow(selected === true), [selected]);

  const handleClick = useCallback(() => setShow(s => !s), []);

  return useMemo(
    () => (
      <div className={classnames('sip-info-item', 'ba')}>
        <Flex
          justify="between"
          className="sip-info-group--title"
          onClick={handleClick}
        >
          <div
            className={classnames({
              b: selected === true,
              'o-50': filtered === true
            })}
          >
            {group.label}
          </div>
          <div>{show ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>
        </Flex>

        {show && (
          <div className="sip-info-group--events bt">
            {events.map(e => (
              <MemoInfoEvent key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    ),
    [events, group, filtered, selected, show]
  );
};

export const MemoInfoGroup = InfoGroup;

export const InfoEvent: React.FC<{
  event: SelectedAnyEvent;
}> = function({ event }) {
  return (
    <div
      className={classnames('sip-info--event', {
        b: event.selected,
        'o-50': event.filtered
      })}
    >
      {event.label}
    </div>
  );
};

export const MemoInfoEvent = React.memo(InfoEvent);
