import _ from 'lodash';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Actor, AnyEvent, PrimaryKey } from '../models';

type GroupByFunc = (a: AnyEvent) => any;
type GroupsFunc = (e: AnyEvent[]) => any[];
export type Grouping<T extends string = string> = {
  groups: GroupsFunc;
  groupBy: GroupByFunc;
  kind: T;
};
type GroupProps = {
  kind: string;
  items: any[];
};

export type GroupedEvent = AnyEvent & { group: PrimaryKey };

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
  const setGroup: <T extends string>(
    grouping: Grouping<T>
  ) => void = useCallback(grouping => {
    setGrouping(grouping);
  }, []);

  const groups: GroupProps = useMemo(() => {
    return { kind: grouping.kind, items: grouping.groups(events) };
  }, [grouping, events]);

  const groupifiedEvents = useMemo(
    function() {
      return _.map(
        events,
        (a: AnyEvent): GroupedEvent => ({
          ...a,
          group: grouping.groupBy(a)
        })
      );
    },
    [events, grouping]
  );

  useEffect(() => {
    console.log(groupifiedEvents, groups, setGroup, group);
  }, [groupifiedEvents, groups, setGroup, group]);

  return [groupifiedEvents, groups, setGroup, group];
}
