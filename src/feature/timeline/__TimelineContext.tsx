import React, { useState } from 'react';
import { getLocalisation } from '../../data';
import { DeprecatedAnyEvent, Ressource, PrimaryKey } from '../../data/models';
import _ from 'lodash';

function groupByActor(a: DeprecatedAnyEvent) {
  return a.actor.id;
}

function groupByNamedPlace(a: DeprecatedAnyEvent) {
  const loc = getLocalisation(a);
  return loc ? loc.id : 0;
}

function groupsActor(events: DeprecatedAnyEvent[]) {
  return _(events)
    .uniqBy('actor.id')
    .map((e) => e.actor)
    .value();
}

function groupsNamedPlace(events: DeprecatedAnyEvent[]) {
  return _(events)
    .uniqBy((e) => {
      const localisation = getLocalisation(e);
      return (localisation && localisation.id) || 0;
    })
    .map((e) => {
      const localisation = getLocalisation(e);
      return (
        localisation || {
          id: 0,
          label: 'Inconnue',
          kind: 'NamedPlace',
          url: 'unknown',
          uri: 'unknown',
        }
      );
    })
    .value();
}

export const TimelineContext = React.createContext({} as any);

export const GROUP_BY: {
  [k: string]: GroupingProps;
} = {
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
};

type GroupingProps = {
  groups: (events: DeprecatedAnyEvent[]) => Ressource[];
  groupBy: (a: DeprecatedAnyEvent) => PrimaryKey;
  kind: string;
};

type DisplayTypesMap = {
  [k in DeprecatedAnyEvent['kind']]: boolean;
};

export function useTimelineContext(): {
  grouping: GroupingProps;
  setGroup: React.Dispatch<React.SetStateAction<GroupingProps>>;
  // displayTypes: _.Dictionary<boolean>;
  // toggle: (typ: string) => void;
} {
  const [grouping, setGroup] = useState(GROUP_BY.actor);
  // const [displayTypes, setDisplayTypes] = useState(() =>
  //   _(types)
  //     .map<[DeprecatedAnyEvent['kind'], boolean]>(t => [t, true])
  //     .fromPairs()
  //     .value()
  // );
  // console.log(types, displayTypes);

  // const toggle = useCallback((typ: any) => {
  //   setDisplayTypes(state => {
  //     state[typ] = !state[typ];
  //     return { ...state };
  //   });
  // }, []);
  return {
    grouping,
    setGroup,
    // displayTypes,
    // toggle
  };
}
