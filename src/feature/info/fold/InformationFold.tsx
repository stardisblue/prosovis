import React from 'react';

import { Ressource } from '../../../data/typings';
import classnames from 'classnames';

import { LocationIcon } from '@primer/octicons-react';
import { SelectedEvent } from '../models';
import { Note } from '../../../components/ui/Note';
import ActorIcon from './ActorIcon';
// import useHoverHighlight from '../../../hooks/useHoverHighlight';
// import { useClickSelect } from '../../../hooks/useClick';
import styled from 'styled-components/macro';
import { IconSpacerPointer } from '../../../components/ui/IconSpacer';
import { SiprojurisEvent } from '../../../data/sip-typings';

// TODO griser personnes
// surlingé : survol
// gras: selectionné
// normal: normal
// grisé: filtré
// TODO ajouter un espacement entre normal et grisé
//
// mettre une personne floue
// TODO mettre surbrillance tout ce qui est personne selectionnée
// griser timeline lors du survol sur les autres visus

// V0 :
// Barre de recherche globale : lieu & acteur
// synchro timeline-carte-information
// laisser le graphe grisé
type InfoGroupProps = {
  events: SelectedEvent<SiprojurisEvent>[];
  group: Ressource;
  kind: 'Actor' | 'NamedPlace';
  masked: boolean;
  selected: boolean;
  highlighted: boolean;
};

const LocationDiv = styled.div<{ showQuestion: boolean }>(({ showQuestion }) =>
  showQuestion
    ? `
    position: relative;

    &::before {  content: "?";
  font-size: 12px;
  left: -7px;
  top: -4px;
  text-shadow: -1px -1px 0 white,  
    1px -1px 0 white,
    -1px 1px 0 white,
    1px 1px 0 white;
  position: absolute;
  width: 6px;
}`
    : ''
);

/**
 * @deprecated use ActorNote or PlaceNote
 * @param param0
 */
export const InformationFold: React.FC<InfoGroupProps> = function ({
  events,
  group,
  kind,
  masked,
  selected,
  highlighted,
}) {
  // const groupedEvents = useMemo(
  //   () =>
  //     _.reduce(
  //       events,
  //       (acc, e) => {
  //         let last = _.last(acc);

  //         if (last === undefined || last.kind !== e.kind) {
  //           acc.push({
  //             id: e.id,
  //             kind: e.kind,
  //             events: e,
  //             start: _.first(e.datation)!,
  //             end: _.last(e.datation)!,
  //             masked: e.masked,
  //             selected: e.selected,
  //             highlighted: e.highlighted,
  //           });
  //           return acc;
  //         }
  //         if (_.isArray(last.events)) {
  //           last.events.push(e);
  //         } else {
  //           last.events = [last.events, e];
  //         }

  //         last.start = _.minBy(
  //           [last.start, _.first(e.datation)],
  //           'clean_date'
  //         )!;
  //         last.end = _.maxBy([last.end, _.last(e.datation)], 'clean_date')!;

  //         if (e.selected !== undefined) {
  //           last.selected = last.selected || e.selected;
  //         }

  //         if (e.highlighted !== undefined) {
  //           last.highlighted = last.highlighted || e.highlighted;
  //         }
  //         if (e.masked !== undefined) {
  //           last.masked = last.masked && e.masked;
  //         }

  //         return acc;
  //       },
  //       [] as EventGroup<
  //         SelectedEvent<SiprojurisEvent>[] | SelectedEvent<SiprojurisEvent>
  //       >[]
  //     ),
  //   [events]
  // );

  // const interactive = useMemo(
  //   () => _.map(events, (e) => ({ id: e.id, kind: 'Event' })),
  //   [events]
  // );

  return (
    <Note
      title={
        <>
          {kind === 'Actor' ? (
            <ActorIcon id={group.id} />
          ) : (
            <IconSpacerPointer>
              <LocationIcon />
            </IconSpacerPointer>
          )}
          <LocationDiv
            showQuestion={kind === 'NamedPlace' && !hasCoordinates(group)}
            className={classnames('flex-auto', {
              b: selected,
              'o-50': masked,
            })}
          >
            {group.label}
          </LocationDiv>
        </>
      }
    >
      test
    </Note>
  );

  // return (
  //   <Fold
  //     className={classnames({ 'bg-light-gray': highlighted })}
  //     events={groupedEvents.map((e) =>
  //       _.isArray(e.events) ? (
  //         <KindGroup key={e.id} {...(e as any)} origin={kind} />
  //       ) : (
  //         <EventInfo key={e.id} event={e.events} origin={kind} />
  //       )
  //     )}
  //     handleClick={useClickSelect(interactive)}
  //     {...useHoverHighlight(interactive)}
  //   >
  //   </Fold>
  // );
};

function hasCoordinates(obj: any) {
  return obj.lng != null && obj.lat != null;
}

export default InformationFold;
