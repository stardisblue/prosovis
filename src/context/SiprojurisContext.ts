import React, { useState, useCallback, useMemo } from 'react';
import { Actor, AnyEvent, PrimaryKey } from '../data';
import _ from 'lodash';

type HightlightEvents = { id: PrimaryKey; kind: string }[];

type SiprojurisContextProps = {
  actors: Actor[];
  selected?: PrimaryKey[];
  select(events?: PrimaryKey[]): void;
  events: AnyEvent[];
  filteredEvents: AnyEvent[];
  highlights?: HightlightEvents;
  setHighlights(highlight?: HightlightEvents): void;
  setFilter(key: PrimaryKey, filter: any): void;
  types: AnyEvent['kind'][];
  // indexedEvents: _.Dictionary<AnyEvent>;
};

export const SiprojurisContext = React.createContext<SiprojurisContextProps>(
  {} as any
);

function getEvents(actor: Actor): AnyEvent[] {
  const events = [];
  events.push(
    ...actor.birth_set,
    ...actor.death_set,
    ...actor.education_set,
    ..._.map(actor.est_evalue_examen, ({ actor_evalue, ...rest }) => ({
      ...rest,
      actor_evalue,
      actor: actor_evalue
    })),
    ..._.map(actor.evaluer_examen, ({ actor_evaluer, ...rest }) => ({
      ...rest,
      actor_evaluer,
      actor: actor_evaluer
    })),
    ...actor.retirement_set,
    ...actor.suspensionactivity_set,
    ...actor.obtainqualification_set
  );

  return _.map(events, e => {
    e.datation = _.sortBy(e.datation, 'clean_date');
    return e;
  });
}

export const useSiprojurisContext = function(
  dataset: Actor[]
): SiprojurisContextProps {
  const [actors] = useState(dataset);

  const [highlights, setHighlights] = useState<HightlightEvents>();

  const [filters, setFilters] = useState<{ [k: string]: any }>();

  const setFilter = useCallback((key: PrimaryKey, filter: any) => {
    setFilters((state: any) => ({ ...state, [key]: filter }));
  }, []);

  const events = useMemo(
    function() {
      return _.transform(
        actors,
        (acc, actor) => {
          acc.push(...getEvents(actor));
        },
        [] as AnyEvent[]
      );
    },
    [actors]
  );

  const filteredEvents = useMemo(
    () => _.filter(events, e => _.every(filters, f => f(e))),
    [events, filters]
  );
  // const indexedEvents = useMemo(() => _.keyBy(filteredEvents, 'id'), [
  //   filteredEvents
  // ]);

  const [selected, setSelected] = useState<PrimaryKey[] | undefined>();

  const select = useCallback((items?: PrimaryKey[]) => {
    if (items === undefined) return setSelected(undefined);

    setSelected(
      _(items)
        .sort()
        .sortedUniq()
        .value()
    );
  }, []);

  const types = useMemo(
    () =>
      _(events)
        .uniqBy('kind')
        .map('kind')
        .value(),
    [events]
  );

  return {
    selected,
    select,
    actors,
    events,
    // indexedEvents,
    filteredEvents,
    highlights,
    setHighlights,
    setFilter,
    types
  };
};
