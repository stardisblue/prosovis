import React from 'react';
import L from 'leaflet';
import { useLeaflet, LeafletProvider } from './context';
import useLazyRef from '../../../hooks/useLazyRef';
import { useAddControl } from './Control';
import useMount from '../../../hooks/useMount';

export const FeatureGroup: React.FC = function ({ children }) {
  const l = useLeaflet();
  const addControl = useAddControl();
  const $group = useLazyRef(() => L.featureGroup([]));

  useMount(() => {
    const g = $group.current;

    if (addControl) {
      addControl(g);
    } else {
      g.addTo(l.current);
    }

    return () => {
      g.remove();
    };
  });

  return (
    <LeafletProvider value={{ top: l.top, current: $group.current }}>
      {children}
    </LeafletProvider>
  );
};
