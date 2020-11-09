import React from 'react';
import L from 'leaflet';
import { useLeaflet } from './context';
import { useAddControl } from './Control';
import useMount from '../../../hooks/useMount';

export const TileLayer: React.FC<
  {
    url: string;
  } & L.TileLayerOptions
> = function ({ url, children, ...options }) {
  const l = useLeaflet();
  const addToControl = useAddControl();

  useMount(() => {
    const bs = L.tileLayer(url, options);

    if (addToControl) {
      addToControl(bs);
    } else {
      bs.addTo(l.current);
    }

    return () => {
      bs.remove();
    };
  });

  return null;
};
