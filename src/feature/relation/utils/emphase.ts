import { RelationType } from '../selectRelations';
import { RelationMap, Emphase } from '../models';

export const emptymap: {
  ghosts: RelationMap;
  actorRingLinks: RelationMap;
  ringLinks: RelationMap;
} = {
  ghosts: new Map(),
  actorRingLinks: new Map(),
  ringLinks: new Map(),
};
export function parseEmphase(
  { actorRing, locLinks, actors }: RelationType,
  selection: Emphase | null
) {
  if (!selection) return emptymap;
  const actor = actorRing.get(selection.actor);
  if (!actor) return emptymap;
  const ghosts = actor.locsLinks.get(selection.loc)!;
  const actorRingLinks = new Map();
  const linksForPlace = locLinks.get(selection.loc)!;
  const ringLinks = new Map([
    [
      '56415:56839',
      {
        id: '56415:56839',
        source: 56839,
        target: 56415,
        loc: 13319,
        events: [
          108113,
          111215,
          111227,
          112519,
          116089,
          116133,
          116144,
          116336,
          116400,
          130631,
          130633,
        ],
        d: 31,
        med: -3155673600000,
      },
    ],
  ]);
  // foreach actor in links, check the connection they have(with ghosts or actors)
  ghosts.forEach((l1) => {
    actors.forEach((actor) => {
      if (actor.id === selection.actor) return;
      const found = linksForPlace.get([actor.id, l1.target].sort().join(':'));
      if (found) actorRingLinks.set(found.id, found);
    });

    ghosts.forEach((l2) => {
      if (l1.target === l2.target) return;
      const found = linksForPlace.get([l1.target, l2.target].sort().join(':'));
      if (found) ringLinks.set(found.id, found);
    });
  });
  console.log();
  return { ghosts, actorRingLinks, ringLinks };
}
