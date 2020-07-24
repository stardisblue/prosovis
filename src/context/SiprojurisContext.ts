import React, { useState, useCallback, useMemo } from 'react';
import { Actor, AnyEvent, PrimaryKey, getEvents } from '../data';
import { every, filter, keyBy } from 'lodash';
import { flow, uniqBy, map, identity, transform } from 'lodash/fp';

type HightlightEvents = { id: PrimaryKey; kind: string }[];

const getActorsEvents = transform<Actor, AnyEvent[]>((acc, actor) => {
  acc.push(...getEvents(actor));
}, []);

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
  indexedEvents: _.Dictionary<AnyEvent>;
};

export const SiprojurisContext = React.createContext<SiprojurisContextProps>(
  {} as any
);

const getUniqKind = flow(uniqBy<AnyEvent>('kind'), map('kind'));

/**
 *
 * @param dataset
 * @deprecated
 */
export const useSiprojurisContext = function (
  dataset: Actor[]
): SiprojurisContextProps {
  const [actors] = useState(dataset);

  const [highlights, setHighlights] = useState<HightlightEvents>();

  const [filters, setFilters] = useState<{ [k: string]: any }>();

  const setFilter = useCallback((key: PrimaryKey, filter: any) => {
    setFilters((state: any) => ({ ...state, [key]: filter }));
  }, []);

  const events = useMemo(() => getActorsEvents(actors), [actors]);

  const filteredEvents = useMemo(
    () => filter(events, (e) => every(filters, (f) => f(e))),
    [events, filters]
  );

  const indexedEvents = useMemo(() => keyBy(filteredEvents, 'id'), [
    filteredEvents,
  ]);

  const [selected, setSelected] = useState<PrimaryKey[] | undefined>();

  const select = useCallback((items?: PrimaryKey[]) => {
    if (items === undefined) return setSelected(undefined);

    const selection = uniqBy<PrimaryKey>(identity, items);

    setSelected(selection);
  }, []);

  const types = useMemo(() => getUniqKind(events), [events]);

  return {
    selected,
    select,
    actors,
    events,
    indexedEvents,
    filteredEvents,
    highlights,
    setHighlights,
    setFilter,
    types,
  };
};
