import React, { useEffect } from 'react';
import L from 'leaflet';
export const useAddLayer = function(
  $parent: React.MutableRefObject<L.LayerGroup | L.Map>,
  $child: React.MutableRefObject<L.Layer>
) {
  useEffect(function() {
    const p = $parent.current;
    const c = $child.current;
    p.addLayer(c);
    return function() {
      p.removeLayer(c);
    };
    // eslint-disable-next-line
  }, []);
};
