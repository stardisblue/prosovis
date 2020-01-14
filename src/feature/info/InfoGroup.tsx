import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { Ressource, AnyEvent } from '../../data';
import classnames from 'classnames';
import { SelectedAnyEvent } from './models';

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
}> = function({ group, events, selected }) {
  const [show, setShow] = useState(selected === true);

  useEffect(() => setShow(selected === true), [selected]);

  return useMemo(
    () => (
      <div className={classnames('sip-info-item', 'ba')}>
        <div
          className={classnames('sip-info-group--title', {
            b: selected === true
          })}
        >
          {group.label}{' '}
          <a href="#" onClick={() => setShow(s => !s)}>
            show
          </a>
        </div>

        {show && (
          <div className="sip-info-group--events bt">
            {events.map(e => (
              <MemoInfoEvent key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    ),
    [group, events, selected, show]
  );
};

export const MemoInfoGroup = InfoGroup;

export const InfoEvent: React.FC<{
  event: SelectedAnyEvent;
}> = function({ event }) {
  return (
    <div
      className={classnames('sip-info--event', {
        b: event.selected
      })}
    >
      {event.label}
    </div>
  );
};

export const MemoInfoEvent = React.memo(InfoEvent);
