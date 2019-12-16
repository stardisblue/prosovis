import React, { useState, useCallback, useMemo } from 'react';
import { Actor, AnyEvent, PrimaryKey } from './models';
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
  setFilter(filter: any): void;
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
      actor: actor_evalue
    })),
    ..._.map(actor.evaluer_examen, ({ actor_evaluer, ...rest }) => ({
      ...rest,
      actor: actor_evaluer
    })),
    ...actor.retirement_set,
    ...actor.suspensionactivity_set,
    ...actor.obtainqualification_set
  );

  return events;
}

export const useSiprojurisContext = function(
  dataset: Actor[]
): SiprojurisContextProps {
  const [actors] = useState(dataset);

  const [highlights, setHighlights] = useState<HightlightEvents>();

  const [filter, setFilter] = useState<any>(() => (a: AnyEvent) => true);

  const events = useMemo(
    function() {
      return _.reduce(
        actors,
        (acc, actor) => {
          acc.push(...getEvents(actor));
          return acc;
        },
        [] as AnyEvent[]
      );
    },
    [actors]
  );

  const filteredEvents = useMemo(() => _.filter(events, filter), [
    events,
    filter
  ]);
  // const indexedEvents = useMemo(() => _.keyBy(filteredEvents, 'id'), [
  //   filteredEvents
  // ]);

  const [selected, setSelected] = useState<PrimaryKey[] | undefined>();

  const select = useCallback(
    (items?: PrimaryKey[]) => setSelected(items ? items.sort() : undefined),
    []
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
    setFilter
  };
};
