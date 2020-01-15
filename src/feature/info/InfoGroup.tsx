import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Ressource, AnyEvent } from '../../data';
import classnames from 'classnames';

import Octicon, { ChevronDown, ChevronUp } from '@primer/octicons-react';
import { Flex } from '../../components/ui/Flex';
import { MemoInfoEvent } from './InfoEvent';

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
const useStyles = (filtered: boolean, selected: boolean) =>
  useMemo(
    () => ({
      parent: classnames('sip-info-group', 'ba'),
      titleGroup: 'sip-info-group--title',
      titleLabel: classnames('sip-info-group--label', {
        b: selected === true,
        'o-50': filtered === true
      }),
      titleMore: 'mh2',
      events: classnames('sip-info-group--events', 'bt')
    }),
    [filtered, selected]
  );

export const InfoGroup: React.FC<{
  group: Ressource;
  events: AnyEvent[];
  selected: boolean;
  filtered: boolean;
}> = function({ group, events, selected, filtered }) {
  const [show, setShow] = useState(selected === true);

  useEffect(() => setShow(selected === true), [selected]);

  const handleClick = useCallback(() => setShow(s => !s), []);

  /*
   * Styles
   */
  const classes = useStyles(filtered, selected);

  return (
    <div className={classes.parent}>
      <Flex
        justify="between"
        className={classes.titleGroup}
        onClick={handleClick}
      >
        <div className={classes.titleLabel}>{group.label}</div>
        <div className={classes.titleMore}>
          <Octicon
            verticalAlign="text-bottom"
            icon={show ? ChevronUp : ChevronDown}
            ariaLabel={show ? 'Etendre' : 'Réduire'}
          />
        </div>
      </Flex>

      {show && (
        <div className={classes.events}>
          {events.map(e => (
            <MemoInfoEvent key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MemoInfoGroup = InfoGroup;
