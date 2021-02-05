import React, { useState, useRef } from 'react';
import L from 'leaflet';
import { LeafletProvider, LeafletContextProps } from './context';
import useMount from '../../../hooks/useMount';

function useLeafletMap(
  $ref: React.MutableRefObject<HTMLDivElement>,
  defaultBounds: L.LatLngBounds,
  options?: L.MapOptions
) {
  const [value, setValue] = useState<LeafletContextProps>();

  useMount(() => {
    const m = new L.Map($ref.current, {
      ...options,
    });
    m.fitBounds(defaultBounds);
    setValue({ top: m, current: m });

    return () => {
      m.remove();
    };
  });

  return value;
}

const Map: React.FC<{
  defaultBounds: L.LatLngBounds;
  options?: L.MapOptions;
}> = function ({ defaultBounds, options, children }) {
  const $div = useRef(null as any);

  const value = useLeafletMap($div, defaultBounds, options);

  return (
    <div ref={$div}>
      {value && <LeafletProvider value={value}>{children}</LeafletProvider>}
    </div>
  );
};

export default Map;
