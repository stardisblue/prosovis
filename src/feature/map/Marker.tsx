import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import { PrimaryKey } from '../../data';

const DataMarker = L.Marker.extend({
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
  const $marker = useRef(new DataMarker(latlng, options));
  useEffect(function() {
    $l.current.addLayer($marker.current);
    return function() {
      // eslint-disable-next-line
      $l.current.removeLayer($marker.current);
    };
    // eslint-disable-next-line
  }, []);
  return null;
};
