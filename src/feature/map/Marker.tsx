import React, { useEffect } from 'react';
import L from 'leaflet';
import { PrimaryKey } from '../../data';

const DataMarker = L.CircleMarker.extend({
  options: { id: null, kind: null, actor: null }
}) as any;

export const Marker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  latlng: L.LatLngExpression;
  options?: L.MarkerOptions & {
    id: PrimaryKey;
    kind: string;
    actor: PrimaryKey;
  };
}> = function({ latlng, options, $l }) {
  useEffect(function() {
    const marker = new DataMarker(latlng, options);
    $l.current.addLayer(marker);
    return function() {
      // eslint-disable-next-line
      $l.current.removeLayer(marker);
    };
    // eslint-disable-next-line
  }, []);
  return null;
};
