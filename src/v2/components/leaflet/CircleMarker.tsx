import React, { useEffect } from 'react';
import { useLeaflet } from './context';
import useLazyRef from '../../../hooks/useLazyRef';
import L from 'leaflet';
import useMount from '../../../hooks/useMount';

export type CircleMarkerProps = {
  latlng: L.LatLngExpression;
} & L.CircleMarkerOptions;
export const CircleMarker: React.FC<CircleMarkerProps> = function ({
  latlng,
  children,
  ...options
}) {
  const l = useLeaflet();
  const marker = useLazyRef(() => new L.CircleMarker(latlng, options));

  useEffect(() => {
    marker.current.setStyle(options);
  }, [marker, options]);

  useMount(() => {
    let m = marker.current.addTo(l.current);
    return () => {
      m.removeFrom(l.top);
      m.removeFrom(l.current as any);
    };
  });

  return null;
};
