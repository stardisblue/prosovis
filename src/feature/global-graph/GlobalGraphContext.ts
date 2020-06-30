import React, { useState, useCallback, useMemo } from 'react';
import { actorLinksMap } from '../relation/selectRelations';
import { get, debounce, Cancelable } from 'lodash';
import rawNodes from '../../data/actor-nodes';

type Key = number | null;
type GlobalGraphProps = {
  sparker: Key;
  shiner: Key;
  setSparker: React.Dispatch<React.SetStateAction<Key>> & Cancelable;
  setShiner: React.Dispatch<React.SetStateAction<Key>>;
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
  const [sparker, setSparker] = useState<Key>(null);
  const [shiner, setShiner] = useState<Key>(null);

  const canISpark = useCallback(
    (id: number) => {
      if (sparker === null) return false; // don't spark by default

      if (sparker === id) return true;

      console.assert(
        actorLinksMap.get(sparker) !== undefined,
        actorLinksMap,
        sparker,
        'actorLinksMap.get(actorId: %s) cannot be undefined',
        sparker
      );
      return actorLinksMap.get(sparker)?.actors.get(id) !== undefined;
    },
    [sparker]
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
    sparker,
    shiner,
    setSparker: debounceSparker,
    setShiner,
    canIShine,
    canISpark,
  };
};

export default GlobalGraphContext;
