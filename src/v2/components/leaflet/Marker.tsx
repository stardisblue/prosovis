import React from 'react';
import { useLeaflet } from './context';
import useLazyRef from '../../../hooks/useLazyRef';
import L from 'leaflet';
import useMount from '../../../hooks/useMount';
import { createPortal } from 'react-dom';

export type MarkerProps = {
  latlng: L.LatLngExpression;
  radius: number;
} & L.MarkerOptions;
export const Marker: React.FC<MarkerProps> = function ({
  latlng,
  children,
  radius,
  ...options
}) {
  const l = useLeaflet();
  const $div = useLazyRef(function () {
    const $div = document.createElement('div');
    $div.style.fontSize = '0'; // fontsize hack
    return $div;
  });
  const marker = useLazyRef(() => new L.Marker(latlng, options));

  useMount(() => {
    let m = marker.current.addTo(l.current);
    m.setIcon(
      L.divIcon({
        html: $div.current,
        className: '',
        iconSize: [radius * 2, radius * 2],
      })
    );
    return () => {
      m.remove();
      m.removeFrom(l.top);
      m.removeFrom(l.current as any);
    };
  });

  return createPortal(children, $div.current);
};
