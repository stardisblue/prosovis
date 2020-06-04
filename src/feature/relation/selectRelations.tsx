import rawLocs from '../../data/loc-nodes.json';
import rawNodes from '../../data/actor-nodes';

import rawLinks from '../../data/known_links.json';
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { RelationEvent, ActorRelationsMap, RelationNodeType } from './models';
import { selectMaskedEvents } from '../../selectors/mask';

const locs: Map<number, RelationNodeType> = new Map<number, RelationNodeType>(
  _(rawLocs)
    .toPairs()
    .map(([k, v]) => [+k, v] as [number, RelationNodeType])
    .value()
) as any;

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

const links: RelationEvent[] = _.map(
  rawLinks,
  ({ actors, loc, events, d, med }) => ({
    id: actors.join(':'),
    source: actors[0],
    target: actors[1],
    loc,
    events,
    d,
    med,
  })
);

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
              relations.actors.set(source, _.get(rawNodes, source));
            if (!relations.actors.has(target))
              relations.actors.set(target, _.get(rawNodes, target));
            relations.links.set(link.id, link);
          } else if (actors[source]) {
            addRelation(relations, rawNodes, link);
          } else if (actors[target]) {
            link.source = target;
            link.target = source;
            addRelation(relations, rawNodes, link);
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
