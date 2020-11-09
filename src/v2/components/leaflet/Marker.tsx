import React from 'react';
import { useLeaflet } from './context';
import useLazyRef from '../../../hooks/useLazyRef';
import L from 'leaflet';
import useMount from '../../../hooks/useMount';

export type MarkerProps = {
  latlng: L.LatLngExpression;
} & L.CircleMarkerOptions;
export const Marker: React.FC<MarkerProps> = function ({
  latlng,
  children,
  ...options
}) {
  const l = useLeaflet();
  const marker = useLazyRef(() => new L.CircleMarker(latlng, options));

  useMount(() => {
    let m = marker.current.addTo(l.current);

    return () => {
      m.remove();
    };
  });

  return null;
};
