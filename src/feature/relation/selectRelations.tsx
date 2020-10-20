import indexLocalisations from '../../data/index-localisations.json';
import indexActors from '../../data/index-actors';

import rawLinks from '../../data/relations.json';
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { RelationEvent, ActorRelationsMap, RelationNodeType } from './models';
import { selectMaskedEvents } from '../../selectors/mask';
import { pipe, toPairs, map } from 'lodash/fp';

const locs: Map<number, RelationNodeType> = new Map(
  pipe(
    toPairs,
    map(([k, v]) => [+k, v] as [number, RelationNodeType])
  )(indexLocalisations)
);

export type RelationType = {
  locLinks: Map<number, Map<string, RelationEvent>>;
  links: Map<string, RelationEvent>; // link between actors

  /**
   * ```
   * { actorId => {
   *   ghosts: uniq_ghosts,
   *   locsLinks: {
   *     locId => { linkId => RelationLink }}}}
   * ```
   */
  actorRing: Map<number, { ghosts: Set<number>; locsLinks: ActorRelationsMap }>;
  ghosts: Map<number, RelationNodeType>;
  actors: Map<number, RelationNodeType>; // all people information ( actors)
};

function addRelation(
  relations: RelationType,
  rawNodes: _.Dictionary<RelationNodeType>,
  link: RelationEvent
) {
  let outer = relations.actorRing.get(link.source);
  if (!outer) {
    relations.actorRing.set(
      link.source,
      (outer = { ghosts: new Set(), locsLinks: new Map() })
    );
  }
  outer.ghosts.add(link.target);

  const locsLinks = outer.locsLinks;

  let locLinks = locsLinks.get(link.loc);
  if (!locLinks) locsLinks.set(link.loc, (locLinks = new Map()));
  locLinks.set(link.id, link);

  if (!relations.ghosts.has(link.target))
    relations.ghosts.set(link.target, rawNodes[link.target]);

  if (!relations.actors.has(link.source))
    relations.actors.set(link.source, rawNodes[link.source]);
}

const compareByKeySelector = createSelectorCreator(defaultMemoize, function (
  a,
  b
) {
  return _.isEqual(_.keys(a), _.keys(b));
});

export const selectActorsFromMaskedEvents = createSelector(
  selectMaskedEvents,
  (events) => _(events).uniqBy('actor.id').map('actor').keyBy('id').value()
);

const links: RelationEvent[] = _.map(rawLinks, ({ actors, ...props }) => ({
  ...props,
  id: actors.join(':'),
  source: actors[0],
  target: actors[1],
}));

export const actorLinksMap = _(links)
  .transform((relations, l) => {
    let srels = relations.get(l.source);
    if (srels === undefined) {
      srels = { events: new Set(), actors: new Map() };
      relations.set(l.source, srels);
    }
    srels.actors.set(l.target, l);
    l.events.forEach((e) => srels!.events.add(e));

    let trels = relations.get(l.target);
    if (trels === undefined) {
      trels = { events: new Set(), actors: new Map() };
      relations.set(l.target, trels);
    }
    trels.actors.set(l.source, l);
    l.events.forEach((e) => trels!.events.add(e));
  }, new Map<number, { events: Set<number>; actors: Map<number, RelationEvent> }>())
  .value();

export const selectRelations = compareByKeySelector(
  selectActorsFromMaskedEvents,
  (actors) => {
    return _.transform(
      links,
      function (relations, link) {
        const { source, target } = link;
        if (actors[source] || actors[target]) {
          link = { ...link };

          if (actors[source] && actors[target]) {
            // both are actors
            if (!relations.actors.has(source))
              relations.actors.set(source, _.get(indexActors, source));
            if (!relations.actors.has(target))
              relations.actors.set(target, _.get(indexActors, target));
            relations.links.set(link.id, link);
          } else if (actors[source]) {
            addRelation(relations, indexActors, link);
          } else if (actors[target]) {
            link.source = target;
            link.target = source;
            addRelation(relations, indexActors, link);
          }
        }
        let l = relations.locLinks.get(link.loc);
        if (!l) {
          relations.locLinks.set(link.loc, (l = new Map()));
        }
        l.set(link.id, link);
      },
      {
        locLinks: new Map(),
        actorRing: new Map(),
        links: new Map(),
        ghosts: new Map(),
        actors: new Map(),
      } as RelationType
    );
  }
);

export const selectLocalisations = () => locs;
export const selectRelationNodes = createSelector(
  selectRelations,
  ({ actors }) => actors
);

export const selectRelationActorRing = createSelector(
  selectRelations,
  ({ actorRing }) => actorRing
);

export const selectRelationLinks = createSelector(
  selectRelations,
  ({ links }) => links
);

export const selectRelationGhosts = createSelector(
  selectRelations,
  ({ ghosts }) => ghosts
);
