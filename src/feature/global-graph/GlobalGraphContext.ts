import React, { useState, useCallback, useMemo } from 'react';
import {
  selectActorLinksMap,
  selectActorsData,
} from '../relation/selectRelations';
import { get, debounce, Cancelable } from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

type Key = string | null;
type GlobalGraphProps = {
  sparker: Key;
  shiner: Key;
  setSparker: React.Dispatch<React.SetStateAction<Key>> & Cancelable;
  setShiner: React.Dispatch<React.SetStateAction<Key>>;
  canIShine: (id: string) => boolean;
  canISpark: (id: string) => boolean;
};
export const GlobalGraphContext = React.createContext<GlobalGraphProps>(
  {} as any
);

export const selectGetActorInformations = createSelector(
  selectActorLinksMap,
  selectActorsData,
  (actorLinksMap, actors) =>
    function getActorInformations(id: string) {
      console.assert(
        actorLinksMap.get(id) !== undefined,
        actorLinksMap,
        id,
        'actorLinksMap.get(actorId: %s) cannot be undefined',
        id
      );
      return {
        actor: get(actors.index, id)!,
        eventIds: actorLinksMap.get(id)!.events,
      };
    }
);

export const useGlobalGraphContext = function (): GlobalGraphProps {
  const [sparker, setSparker] = useState<Key>(null);
  const [shiner, setShiner] = useState<Key>(null);
  const actorLinksMap = useSelector(selectActorLinksMap);

  const canISpark = useCallback(
    (id: string) => {
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
    [sparker, actorLinksMap]
  );

  const canIShine = useCallback(
    (id: string) => {
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
    [shiner, actorLinksMap]
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
