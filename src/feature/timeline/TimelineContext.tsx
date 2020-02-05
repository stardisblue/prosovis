import React, { useState, useCallback } from 'react';
import { AnyEvent, Ressource, PrimaryKey } from '../../data';
import _ from 'lodash';

function groupByActor(a: AnyEvent) {
  return a.actor.id;
}

function groupByNamedPlace(a: any) {
  return a.localisation ? a.localisation.id : 0;
}

function groupsActor(events: AnyEvent[]) {
  return _(events)
    .uniqBy('actor.id')
    .map(e => e.actor)
    .value();
}

function groupsNamedPlace(events: AnyEvent[]) {
  return _(events)
    .uniqBy('localisation.id')
    .map(
      e =>
        (e as any).localisation || {
          id: 0,
          label: 'Inconnue',
          kind: 'NamedPlace'
        }
    )
    .value();
}

export const TimelineContext = React.createContext({} as any);

export const GROUP_BY: {
  [k: string]: GroupingProps;
} = {
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
};

type GroupingProps = {
  groups: (events: AnyEvent[]) => Ressource[];
  groupBy: (a: AnyEvent) => PrimaryKey;
  kind: string;
};

type DisplayTypesMap = {
  [k in AnyEvent['kind']]: boolean;
};

export function useTimelineContext(
  types: AnyEvent['kind'][]
): {
  grouping: GroupingProps;
  setGroup: React.Dispatch<React.SetStateAction<GroupingProps>>;
  displayTypes: _.Dictionary<boolean>;
  toggle: (typ: string) => void;
} {
  const [grouping, setGroup] = useState(GROUP_BY.actor);
  const [displayTypes, setDisplayTypes] = useState(() =>
    _(types)
      .map<[AnyEvent['kind'], boolean]>(t => [t, true])
      .fromPairs()
      .value()
  );
  const toggle = useCallback((typ: any) => {
    setDisplayTypes(state => {
      state[typ] = !state[typ];
      return { ...state };
    });
  }, []);
  return { grouping, setGroup, displayTypes, toggle };
}