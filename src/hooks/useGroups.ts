import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { Actor, AnyEvent, PrimaryKey } from '../data';

type GroupByFunc = (a: AnyEvent) => any;
type GroupsFunc = (e: AnyEvent[]) => any[];
export type Grouping<T extends string = string> = {
  groups: GroupsFunc;
  groupBy: GroupByFunc;
  kind: T;
};
export type GroupProps = {
  kind: string;
  items: any[];
};

export type GroupedEvent = AnyEvent & { group: PrimaryKey };

/**
 * Allows to group events by NamedPlace or Actors
 * @param events
 * @param actors
 */
export function useGroups(
  events: AnyEvent[],
  actors: Actor[]
): [
  GroupedEvent[],
  {
    kind: string;
    items: any[];
  },
  (grouping: Grouping) => void,
  {
    actor: Grouping<'Actor'>;
    localisation: Grouping<'NamedPlace'>;
  }
] {
  function groupByActor(a: AnyEvent) {
    return a.actor.id;
  }
  function groupByNamedPlace(a: any) {
    return a.localisation ? a.localisation.id : 0;
  }
  const groupsActor = useCallback(
    function() {
      return actors;
    },
    [actors]
  );
  function groupsNamedPlace(events: AnyEvent[]) {
    return _(events)
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
  }
  const group: {
    actor: Grouping<'Actor'>;
    localisation: Grouping<'NamedPlace'>;
  } = useMemo(
    () => ({
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
    }),
    [groupsActor]
  );
  // default: group by actors
  const [grouping, setGrouping] = useState<Grouping>(group.actor);

  const groups: GroupProps = useMemo(
    () => ({ kind: grouping.kind, items: grouping.groups(events) }),
    [grouping, events]
  );

  const groupifiedEvents = useMemo(
    () =>
      _.map(
        events,
        (a): GroupedEvent => ({
          ...a,
          group: grouping.groupBy(a)
        })
      ),
    [events, grouping]
  );

  return [groupifiedEvents, groups, setGrouping, group];
}
