import { createSelector } from '@reduxjs/toolkit';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { ActorRelationsMap } from './models';
import { selectMaskedEvents } from '../../selectors/mask';
import { ProsoVisSignedRelation } from '../../v2/types/relations';
import { ProsoVisActor } from '../../v2/types/actors';
import { selectActors } from '../../v2/selectors/actors';
import {
  get,
  isEqual,
  keyBy,
  keys,
  map,
  pipe,
  transform,
  uniqBy,
} from 'lodash/fp';
import { selectRelations } from '../../v2/selectors/relations';
import { ProsoVisDetailRichEvent } from '../../v2/types/events';

export type RelationType = {
  locLinks: Map<string, Map<string, ProsoVisSignedRelation>>;
  links: Map<string, ProsoVisSignedRelation>; // link between actors

  /**
   * ```
   * { actorId => {
   *   ghosts: uniq_ghosts,
   *   locsLinks: {
   *     locId => { linkId => RelationLink }}}}
   * ```
   */
  actorRing: Map<string, { ghosts: Set<string>; locsLinks: ActorRelationsMap }>;
  ghosts: Map<string, ProsoVisActor>;
  actors: Map<string, ProsoVisActor>; // all people information ( actors)
};

function addRelation(
  relations: RelationType,
  actors: _.Dictionary<ProsoVisActor>,
  link: ProsoVisSignedRelation
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
    relations.ghosts.set(link.target, actors[link.target]);

  if (!relations.actors.has(link.source))
    relations.actors.set(link.source, { ...actors[link.source] });
}

const compareByKeySelector = createSelectorCreator(
  defaultMemoize,
  function (a, b) {
    return isEqual(keys(a), keys(b));
  }
);

export const selectActorsFromMaskedEvents = createSelector(
  selectMaskedEvents,
  (events) =>
    pipe(
      uniqBy<ProsoVisDetailRichEvent>('actor.id'),
      map('actor'),
      keyBy<ProsoVisActor>('id')
    )(events)
);

export const selectLinks = createSelector(selectRelations, (relations) => {
  return map(
    ({ actors, ...props }) => ({
      ...props,
      id: actors.join(':'),
      source: actors[0],
      target: actors[1],
    }),
    relations
  );
});

/** @deprecated */
// export const selectActorLinksMap = createSelector(selectLinks, (links) => {
//   return transform(
//     (relations, l) => {
//       let srels = relations.get(l.source);
//       if (srels === undefined) {
//         srels = { events: new Set(), actors: new Map() };
//         relations.set(l.source, srels);
//       }
//       srels.actors.set(l.target, l);
//       l.events.forEach((e) => srels!.events.add(e));

//       let trels = relations.get(l.target);
//       if (trels === undefined) {
//         trels = { events: new Set(), actors: new Map() };
//         relations.set(l.target, trels);
//       }
//       trels.actors.set(l.source, l);
//       l.events.forEach((e) => trels!.events.add(e));
//     },
//     new Map<
//       string,
//       { events: Set<string>; actors: Map<string, ProsoVisSignedRelation> }
//     >(),
//     links
//   );
// });

export const selectDetailRelations = compareByKeySelector(
  selectActorsFromMaskedEvents,
  selectLinks,
  selectActors,
  (actors, links, indexActors = {}) => {
    return transform(
      function (relations, link) {
        const { source, target } = link;
        if (actors[source] || actors[target]) {
          link = { ...link };

          if (actors[source] && actors[target]) {
            // both are actors
            if (!relations.actors.has(source))
              relations.actors.set(source, { ...get(source, indexActors) });
            if (!relations.actors.has(target))
              relations.actors.set(target, { ...get(target, indexActors) });
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
      } as RelationType,
      links
    );
  }
);

export const selectRelationNodes = createSelector(
  selectDetailRelations,
  ({ actors }) => actors
);

export const selectRelationActorRing = createSelector(
  selectDetailRelations,
  ({ actorRing }) => actorRing
);

export const selectRelationLinks = createSelector(
  selectDetailRelations,
  ({ links }) => links
);

export const selectRelationGhosts = createSelector(
  selectDetailRelations,
  ({ ghosts }) => ghosts
);
