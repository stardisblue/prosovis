import rawNodes from '../../data/actor-nodes.json';
import rawLinks from '../../data/known_links.json';
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import {
  RelationEvent,
  ActorRelationsMap,
  RelationNode,
  RawRelationLink,
} from './models';
import { selectMaskedEvents } from '../../selectors/mask';
export type RelationType = {
  inners: Map<string, RelationEvent>; // link between actors

  /**
   * ```
   * { actorId => {
   *   count: uniq_ghosts,
   *   items: {
   *     locId => { linkId => RelationLink }}}}
   * ```
   */
  outers: Map<
    number, // actorId
    {
      count: Set<number>; // number of unique ghosts
      items: ActorRelationsMap; // links from actor to ghosts grouped by localisation
    }
  >;
  ghosts: Map<number, RelationNode>;
  actors: Map<number, RelationNode>; // all people information ( actors)
};

export const compareByKeySelector = createSelectorCreator(
  defaultMemoize,
  function (a, b) {
    return _.isEqual(_.keys(a), _.keys(b));
  }
);

export const selectActorsFromMaskedEvents = createSelector(
  selectMaskedEvents,
  (events) => _(events).uniqBy('actor.id').map('actor').keyBy('id').value()
);
export const selectRelations = compareByKeySelector(
  selectActorsFromMaskedEvents,
  (actors) => {
    // console.log(actors);
    const defaultMap: RelationType = {
      outers: new Map(),
      inners: new Map(),
      ghosts: new Map(),
      actors: new Map(),
    };
    return _.transform(
      rawLinks as RawRelationLink[],
      (relations, raw) => {
        if (_.some(raw.actors, (a) => actors[a] !== undefined)) {
          const {
            actors: [source, target],
            ...rest
          } = raw;

          const link = {
            id: raw.actors.join(':'),
            source,
            target,
            ...rest,
          };

          if (actors[source] && actors[target]) {
            // both are actors
            if (!relations.actors.has(source))
              relations.actors.set(source, _.get(rawNodes, source));

            if (!relations.actors.has(target))
              relations.actors.set(target, _.get(rawNodes, target));

            relations.inners.set(link.id, link);
          } else if (actors[source]) {
            addRelation(relations, rawNodes, link);
          } else if (actors[target]) {
            link.source = target;
            link.target = source;
            addRelation(relations, rawNodes, link);
          }
        }
      },
      defaultMap
    );
  }
);

export function addRelation(
  map: RelationType,
  rawNodes: _.Dictionary<RelationNode>,
  link: RelationEvent
) {
  let outer = map.outers.get(link.source);
  if (!outer)
    map.outers.set(
      link.source,
      (outer = { count: new Set(), items: new Map() })
    );
  outer.count.add(link.target);

  const nodegroup = map.outers.get(link.source)!.items;

  let locs = nodegroup.get(link.loc);
  if (!locs) nodegroup.set(link.loc, (locs = new Map()));
  locs.set(link.id, link);

  if (!map.ghosts.has(link.target))
    map.ghosts.set(link.target, rawNodes[link.target]);

  if (!map.actors.has(link.source))
    map.actors.set(link.source, rawNodes[link.source]);
}
