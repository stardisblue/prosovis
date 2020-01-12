import React, { useState, useCallback } from 'react';
import { AnyEvent, Ressource, PrimaryKey } from '../../data';
import _ from 'lodash';
import * as d3 from 'd3';

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

const color = d3
  .scaleOrdinal<string, string>()
  .domain([
    'Birth',
    'Death',
    'Education',
    'PassageExamen',
    'SuspensionActivity',
    'ObtainQualification',
    'Retirement'
  ])
  .range((d3 as any).schemeTableau10);

const border = d3
  .scaleOrdinal<string, string>()
  .domain(color.domain())
  .range(
    color.range().map(d =>
      d3
        .color(d)!
        .darker(2)
        .toString()
    )
  );

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
export function useTimelineContext(
  types: string[]
): {
  grouping: GroupingProps;
  setGroup: React.Dispatch<React.SetStateAction<GroupingProps>>;
  displayTypes: _.Dictionary<any>;
  toggle: (typ: string) => void;
  color: d3.ScaleOrdinal<string, string>;
  border: d3.ScaleOrdinal<string, string>;
} {
  const [grouping, setGroup] = useState(GROUP_BY.actor);
  const [displayTypes, setDisplayTypes] = useState(() =>
    _(types)
      .map(t => [t, true])
      .fromPairs()
      .value()
  );
  const toggle = useCallback((typ: string) => {
    setDisplayTypes(state => {
      state[typ] = !state[typ];
      return { ...state };
    });
  }, []);
  return { grouping, setGroup, displayTypes, toggle, color, border };
}
