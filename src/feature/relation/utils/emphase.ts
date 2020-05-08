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

  const actorRingLinks: RelationMap = new Map();
  const ringLinks: RelationMap = new Map();

  const ghosts = actor.locsLinks.get(selection.loc)!;
  const linksForPlace = locLinks.get(selection.loc)!;
  // foreach actor in links, check the connection they have(with ghosts or actors)
  ghosts.forEach((l1) => {
    actors.forEach((actor) => {
      if (actor.id === selection.actor) return;
      const found = linksForPlace.get([actor.id, l1.target].sort().join(':'));
      if (found) actorRingLinks.set(found.id, found);
    });

    // ghosts.forEach((l2) => {
    //   if (l1.target === l2.target) return;
    //   const found = linksForPlace.get([l1.target, l2.target].sort().join(':'));
    //   if (found) ringLinks.set(found.id, found);
    // });
  });
  console.log();
  return { ghosts, actorRingLinks, ringLinks };
}
