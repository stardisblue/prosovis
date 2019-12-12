import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Actor, AnyEvent, NamedPlace } from './models';
import _ from 'lodash';

type Groupable = { group: number };

export type AugmentedEvent = AnyEvent & Partial<Groupable>;

type HightlightEvents = { id: number | string; kind: string }[];
type GroupByFunc = (a: AnyEvent) => any;
type GroupsFunc = (e: AugmentedEvent[]) => any[];

type Grouping<T extends string = string> = {
  groups: GroupsFunc;
  groupBy: GroupByFunc;
  kind: T;
};

type SiprojurisContextProps = {
  actors: Actor[];
  selected?: Actor | NamedPlace;
  select(id: number | string): void;
  events: AnyEvent[];
  augmentedEvents: AugmentedEvent[];
  groups: { kind: string; items: any[] };
  setGroup<T extends string>(grouping: Grouping<T>): void;
  highlights: HightlightEvents;
  setHighlights(highlight: HightlightEvents): void;
  setFilter(filter: any): void;
  group: { actor: Grouping<'Actor'>; localisation: Grouping<'NamedPlace'> };
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

  const [highlights, setHighlights] = useState<HightlightEvents>([]);

  const groupByActor = (a: AugmentedEvent) => a.actor.id;
  const groupByNamedPlace = (a: any) =>
    (a.localisation && a.localisation.id) || 0;

  const groupsActor = useCallback(() => actors, [actors]);
  const groupsNamedPlace = (selection: AugmentedEvent[]) =>
    _(selection)
      .map(
        e =>
          (e as any).localisation || {
            id: 0,
            label: 'Inconnue',
            kind: 'NamedPlace'
          }
      )
      .uniqBy('id')
      .value();

  // default: group by actors
  const [grouping, setGrouping] = useState<Grouping>({
    groupBy: groupByActor,
    groups: groupsActor,
    kind: 'Actor'
  });

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
  const augmentedEvents = useMemo(
    function() {
      return _(events)
        .filter(filter)
        .map(
          (a: AnyEvent): AugmentedEvent => ({
            ...a,
            group: grouping.groupBy(a)
          })
        )
        .value();
    },
    [events, filter, grouping.groupBy]
  );

  const groups = useMemo(() => {
    return { kind: grouping.kind, items: grouping.groups(events) };
  }, [grouping.kind, grouping.groups, events]);

  const [selected, setSelected] = useState<Actor | undefined>();

  const select = useCallback(
    (id: number | string) => {
      return setSelected(_.find(groups.items, ['id', id]));
    },
    [groups]
  );

  useEffect(() => {
    setSelected(undefined);
  }, [groups]);

  return {
    selected,
    select,
    actors,
    events,
    augmentedEvents,
    groups,
    highlights,
    setHighlights,
    setGroup: grouping => {
      setGrouping(grouping);
    },
    setFilter,
    group: {
      actor: {
        groups: groupsActor,
        groupBy: groupByActor,
        kind: 'Actor'
      },
      localisation: {
        groups: groupsNamedPlace,
        groupBy: groupByNamedPlace,
        kind: 'NamedPlace'
      }
    }
  };
};
