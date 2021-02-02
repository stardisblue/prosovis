import React, { useState, useCallback, useMemo } from 'react';
import { selectActorLinksMap } from '../relation/selectRelations';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
// import { selectEventIndex } from '../../v2/selectors/events';
// import { selectActors } from '../../v2/selectors/actors';

type Key = string | null;
type GlobalGraphProps = {
  sparker: Key;
  shiner: Key;
  setSparker: _.DebouncedFunc<React.Dispatch<React.SetStateAction<Key>>>;
  setShiner: React.Dispatch<React.SetStateAction<Key>>;
  canIShine: (id: string) => boolean;
  canISpark: (id: string) => boolean;
};
export const GlobalGraphContext = React.createContext<GlobalGraphProps>(
  {} as any
);

export const useGlobalGraphContext = function (): GlobalGraphProps {
  const [sparker, setSparker] = useState<Key>(null);
  const [shiner, setShiner] = useState<Key>(null);
  const actorLinksMap = useSelector(selectActorLinksMap);
  // const eventIndex = useSelector(selectEventIndex);
  // const actorIndex = useSelector(selectActors);

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
