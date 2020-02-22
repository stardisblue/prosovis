import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useAddLayer } from './useAddLayer';

export const MarkerClusterGroup: React.FC<{
  $l: React.MutableRefObject<L.Map>;
  markers: (ref: React.MutableRefObject<L.MarkerClusterGroup>) => JSX.Element[];
  options?: L.MarkerClusterGroupOptions;
  onClusterClick?: L.LeafletMouseEventHandlerFn;
}> = function({ $l, markers, options, onClusterClick }) {
  const $group = useRef(L.markerClusterGroup(options));

  useEffect(
    function() {
      console.log('onmount');

      const p = $l.current;
      p.addLayer($group.current);
      return function() {
        // eslint-disable-next-line
        p.removeLayer($group.current);
      };
    },
    // eslint-disable-next-line
    []
  );

  useEffect(
    function() {
      if (!onClusterClick) return;
      const group = $group.current;
      group.on('clusterclick' as any, onClusterClick);
      return () => {
        group.off('clusterclick' as any, onClusterClick);
      };
    },
    [onClusterClick]
  );

  return <>{markers($group)}</>;
};
