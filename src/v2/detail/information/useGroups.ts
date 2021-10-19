import { flow, groupBy, map, sortBy, get, concat, orderBy } from 'lodash/fp';
import { createSelector } from 'reselect';
import { maskedEventsAsMap } from '../../../selectors/mask';
import { selectionAsMap } from '../../../selectors/selection';
import { superHighlightAsMap } from '../../../selectors/superHighlights';
import { selectDetailsRichEvents } from '../../selectors/detail/actors';
import { ProsoVisActor } from '../../types/actors';
import { ProsoVisDetailRichEvent } from '../../types/events';
import { ProsoVisLocalisation, ProsoVisPlace } from '../../types/localisations';
import { InformationGroup, Interactive } from './types';

const unknownLocalisation: ProsoVisLocalisation = {
  id: '-1',
  label: 'Inconnue',
  kind: 'NamedPlace',
  uri: 'unknown',
  lat: null,
  lng: null,
};

const selectInformationEvents = createSelector(
  selectDetailsRichEvents,
  selectionAsMap,
  maskedEventsAsMap,
  superHighlightAsMap,
  function (events, selected, masked, highlighted) {
    return flow(
      map((e: ProsoVisDetailRichEvent) => ({
        ...e,
        highlighted: highlighted[e.event.id] !== undefined,
        selected: selected[e.event.id] !== undefined,
        masked: masked[e.event.id] === undefined,
      })),
      sortBy<Interactive<ProsoVisDetailRichEvent>>(
        'event.datation[0].clean_date'
      )
    )(events);
  }
);

export const selectInformationGroups = createSelector(
  selectInformationEvents,
  function (events) {
    const actorGroups = flow(
      groupBy<Interactive<ProsoVisDetailRichEvent>>('actor.id'),
      map(
        (events) =>
          ({
            group: get('0.actor', events),
            events: sortBy('event.datation.0.value', events),
            highlighted: events.some((v) => v.highlighted),
            selected: events.some((v) => v.selected),
            masked: !events.some((v) => !v.masked),
          } as Interactive<InformationGroup<ProsoVisActor>>)
      )
    )(events);
    const localisationGroups = flow(
      groupBy<Interactive<ProsoVisDetailRichEvent>>('place.id'),
      map(
        (events) =>
          ({
            group: get('0.place', events) ?? unknownLocalisation,
            events,
            highlighted: events.some((v) => v.highlighted),
            selected: events.some((v) => v.selected),
            masked: !events.some((v) => !v.masked),
          } as Interactive<InformationGroup<ProsoVisPlace>>)
      )
    )(events);

    return flow(
      orderBy<Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>>(
        ['selected', 'group.kind', ' events.0.event.datation.0.value'],
        ['desc']
      ),
      sortBy(
        (e: Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>) =>
          e.group.id === '-1' ? 1 : 0
      ),
      groupBy<Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>>(
        (e) => (e.masked === true ? 'yes' : 'no')
      )
    )(concat(actorGroups, localisationGroups)) as {
      yes: Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>[];
      no: Interactive<InformationGroup<ProsoVisPlace | ProsoVisActor>>[];
    };
  }
);
