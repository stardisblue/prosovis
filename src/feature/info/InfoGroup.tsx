import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Ressource, AnyEvent } from '../../data';
import classnames from 'classnames';

import Octicon, {
  ChevronDown,
  ChevronUp,
  Person,
  Location
} from '@primer/octicons-react';
import { Flex } from '../../components/ui/Flex';
import { MemoEventInfo } from './EventInfo';

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


// grouper par type d'evenement consécutifs dans le groupe, bla bla bla
const useStyles = (filtered: boolean, selected: boolean) =>
  useMemo(
    () => ({
      parent: classnames('sipig', 'ba', 'b--light-silver', 'mb1'),
      titleIcon: classnames('sipig--icon', 'ma1', 'flex-shrink-0'),
      titleGroup: classnames('sipig--title', 'pa1'),
      titleLabel: classnames('sipig--label', 'flex-auto', {
        b: selected === true,
        'o-50': filtered === true
      }),
      titleMore: classnames('ma1', 'flex-shrink-0'),
      events: classnames('sipig--events', 'bt', 'b--light-silver', 'ph1')
    }),
    [filtered, selected]
  );

export const InfoGroup: React.FC<{
  kind: 'Actor' | 'NamedPlace';
  group: Ressource;
  events: AnyEvent[];
  selected: boolean;
  filtered: boolean;
}> = function({ events, filtered, group, kind, selected }) {
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
        items="baseline"
        onClick={handleClick}
      >
        <Octicon
          className={classes.titleIcon}
          icon={kind === 'Actor' ? Person : Location}
        />
        <div className={classes.titleLabel}>{group.label}</div>
        <Octicon
          className={classes.titleMore}
          verticalAlign="text-bottom"
          icon={show ? ChevronUp : ChevronDown}
          ariaLabel={show ? 'Etendre' : 'Réduire'}
        />
      </Flex>

      {show && (
        <div className={classes.events}>
          {events.map(e => (
            <MemoEventInfo key={e.id} event={e} origin={kind} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MemoInfoGroup = InfoGroup;
