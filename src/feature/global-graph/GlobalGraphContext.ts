import React, { useState, useCallback, useMemo } from 'react';
import { actorLinksMap } from '../relation/selectRelations';
import { get, debounce } from 'lodash';
import rawNodes from '../../data/actor-nodes';

type GlobalGraphProps = {
  sparker: number | null;
  shiner: number | null;
  setSparker: React.Dispatch<React.SetStateAction<number | null>>;
  setShiner: React.Dispatch<React.SetStateAction<number | null>>;
  canIShine: (id: number) => boolean;
  canISpark: (id: number) => boolean;
};
export const GlobalGraphContext = React.createContext<GlobalGraphProps>(
  {} as any
);

export function getActorInformations(id: number) {
  console.assert(
    actorLinksMap.get(id) !== undefined,
    actorLinksMap,
    id,
    'actorLinksMap.get(actorId: %s) cannot be undefined',
    id
  );
  return {
    actor: get(rawNodes, id)!,
    eventIds: actorLinksMap.get(id)!.events,
  };
}
export const useGlobalGraphContext = function (): GlobalGraphProps {
  const [sparkler, setSparker] = useState<number | null>(null);
  const [shiner, setShiner] = useState<number | null>(null);

  const canISpark = useCallback(
    (id: number) => {
      if (sparkler === null) return false; // don't spark by default

      if (sparkler === id) return true;

      console.assert(
        actorLinksMap.get(sparkler) !== undefined,
        actorLinksMap,
        sparkler,
        'actorLinksMap.get(actorId: %s) cannot be undefined',
        sparkler
      );
      return actorLinksMap.get(sparkler)?.actors.get(id) !== undefined;
    },
    [sparkler]
  );

  const canIShine = useCallback(
    (id: number) => {
      if (shiner === null) return true; // shine by default
      if (shiner === id) return true;

      console.assert(
        actorLinksMap.get(shiner) !== undefined,
        actorLinksMap,
        shiner,
        'actorLinksMap.get(actorId: %s) cannot be undefined',
        shiner
      );
      return actorLinksMap.get(shiner)?.actors.get(id) !== undefined;
    },
    [shiner]
  );

  const debounceSparker = useMemo(() => debounce(setSparker, 100), [
    setSparker,
  ]);

  return {
    sparker: sparkler,
    shiner,
    setSparker: debounceSparker,
    setShiner,
    canIShine,
    canISpark,
  };
};

export default GlobalGraphContext;
