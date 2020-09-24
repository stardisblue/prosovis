import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { Actor, DeprecatedAnyEvent, PrimaryKey } from '../../data/models';

type GroupByFunc = (a: DeprecatedAnyEvent) => any;
type GroupsFunc = (e: DeprecatedAnyEvent[]) => any[];
export type Grouping<T extends string = string> = {
  groups: GroupsFunc;
  groupBy: GroupByFunc;
  kind: T;
};
export type GroupProps = {
  kind: string;
  items: any[];
};

export type GroupedEvent = DeprecatedAnyEvent & { group: PrimaryKey };

/**
 * Allows to group events by NamedPlace or Actors
 * @param events
 * @param actors
 */
export function useGroups(
  events: DeprecatedAnyEvent[],
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
  function groupByActor(a: DeprecatedAnyEvent) {
    return a.actor.id;
  }
  function groupByNamedPlace(a: any) {
    return a.localisation ? a.localisation.id : 0;
  }
  const groupsActor = useCallback(
    function () {
      return actors;
    },
    [actors]
  );
  function groupsNamedPlace(events: DeprecatedAnyEvent[]) {
    return _(events)
      .map(
        (e) =>
          (e as any).localisation || {
            id: 0,
            label: 'Inconnue',
            kind: 'NamedPlace',
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
        kind: 'Actor',
      },
      localisation: {
        groups: groupsNamedPlace,
        groupBy: groupByNamedPlace,
        kind: 'NamedPlace',
      },
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
          group: grouping.groupBy(a),
        })
      ),
    [events, grouping]
  );

  return [groupifiedEvents, groups, setGrouping, group];
}
