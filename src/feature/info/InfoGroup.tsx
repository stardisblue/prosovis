import './InfoGroup.sass';
import React, { useMemo, useState, useCallback } from 'react';

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
import { selectSwitch } from '../../reducers/switchSlice';
import { createSelector } from '@reduxjs/toolkit';
import { selectActorColor } from '../../selectors/color';
import { useSelector } from 'react-redux';

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
// griser timeline lors du survol sur les autres visus

// V0 :
// Barre de recherche globale : lieu & acteur
// synchro timeline-carte-information
// laisser le graphe grisé

// grouper par type d'evenement consécutifs dans le groupe, bla bla bla
const useStyles = (filtered: boolean, selected: boolean) =>
  useMemo(
    () => ({
      title: classnames(
        'sipig--title',
        'b--moon-gray',
        'ph1',
        'pt1',
        'flex-grow-0'
      ),
      titleIcon: classnames('sipig--icon', 'ma1', 'flex-shrink-0'),
      titleLabel: classnames('sipig--label', 'flex-auto', {
        b: selected === true,
        'o-50': filtered === true
      }),
      titleMore: classnames('ma1', 'flex-shrink-0'),
      events: classnames(
        // TODO pixel aligner avec l'icon des acteurs
        'sipig--events',
        'bl',
        'bw1',
        'bb',
        'b--moon-gray',
        'overflow-y-auto'
      )
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

const selectColor = createSelector(
  selectSwitch,
  selectActorColor,
  (switcher, actor) => {
    if (switcher === 'Actor') {
      return actor;
    } else {
      return () => 'black';
    }
  }
);

export const InfoGroup: React.FC<InfoGroupProps> = function({
  events,
  filtered,
  group,
  kind,
  selected
}) {
  const [show, setShow] = useState(selected === true);

  //useEffect(() => setShow(selected === true), [selected]);

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
  const color = useSelector(selectColor);

  return (
    <>
      <Flex
        col
        justify="between"
        className={classes.title}
        items="baseline"
        onClick={handleClick}
      >
        <span style={{ color: kind === 'Actor' ? color(group.id) : 'black' }}>
          <Octicon
            className={classes.titleIcon}
            icon={kind === 'Actor' ? Person : Location}
          />
        </span>
        <div className={classes.titleLabel}>{group.label}</div>
        <Octicon
          className={classes.titleMore}
          verticalAlign="text-bottom"
          icon={show ? ChevronUp : ChevronDown}
          ariaLabel={show ? 'Etendre' : 'Réduire'}
        />
      </Flex>

      {show && (
        <div
          className={classes.events}
          style={{
            minHeight: '50px',
            height: groupedEvents.length > 12 ? '600px' : 'auto'
          }}
        >
          {groupedEvents.map(e => (
            <InfoKindGroup key={e.id} {...e} origin={kind} />
          ))}
        </div>
      )}
    </>
  );
};
