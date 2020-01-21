import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Ressource } from '../../data';
import classnames from 'classnames';
import _ from 'lodash';

import Octicon, {
  ChevronDown,
  ChevronUp,
  Person,
  Location
} from '@primer/octicons-react';
import { Flex } from '../../components/ui/Flex';
import { InfoKindGroup } from './InfoKindGroup';
import { EventGroup, SelectedEvent } from './models';

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

type InfoGroupProps = {
  events: SelectedEvent[];
  filtered: boolean;
  group: Ressource;
  kind: 'Actor' | 'NamedPlace';
  selected: boolean;
};

export const InfoGroup: React.FC<InfoGroupProps> = function({
  events,
  filtered,
  group,
  kind,
  selected
}) {
  const [show, setShow] = useState(selected === true);

  useEffect(() => setShow(selected === true), [selected]);

  const handleClick = useCallback(() => setShow(s => !s), []);

  const groupedEvents = useMemo(
    () =>
      _.reduce(
        events,
        (acc, e) => {
          let last = _.last(acc);

          if (last === undefined || last.kind !== e.kind) {
            acc.push({
              id: e.id,
              kind: e.kind,
              events: e,
              start: _.first(e.datation)!,
              end: _.last(e.datation)!,
              filtered: e.filtered,
              selected: e.selected
            });
            return acc;
          }
          if (_.isArray(last.events)) {
            last.events.push(e);
          } else {
            last.events = [last.events, e];
          }

          last.start = _.minBy(
            [last.start, _.first(e.datation)],
            'clean_date'
          )!;
          last.end = _.maxBy([last.end, _.last(e.datation)], 'clean_date')!;

          if (e.selected !== undefined) {
            last.selected = last.selected || e.selected;
          }
          if (e.filtered !== undefined) {
            last.filtered = last.filtered && e.filtered;
          }

          return acc;
        },
        [] as EventGroup[]
      ),
    [events]
  );

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
          {/* {events.map(e => (
            <MemoEventInfo key={e.id} event={e} origin={kind} />
          ))} */}
          {groupedEvents.map(e => (
            <InfoKindGroup key={e.id} {...e} origin={kind} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MemoInfoGroup = InfoGroup;
