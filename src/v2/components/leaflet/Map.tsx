import React, { useState, useRef } from 'react';
import L from 'leaflet';
import { LeafletProvider, LeafletContextProps } from './context';
import useMount from '../../../hooks/useMount';

function useLeafletMap(
  $ref: React.MutableRefObject<HTMLDivElement>,
  bounds: [[number, number], [number, number]],
  options?: L.MapOptions
) {
  const [value, setValue] = useState<LeafletContextProps>();

  useMount(() => {
    const m = new L.Map($ref.current, {
      ...options,
    });
    m.fitBounds(bounds);
    setValue({ top: m, current: m });

    return () => {
      m.remove();
    };
  });

  return value;
}

const Map: React.FC<{
  bounds: [[number, number], [number, number]];
  options?: L.MapOptions;
}> = function ({ bounds, options, children }) {
  const $div = useRef(null as any);

  const value = useLeafletMap($div, bounds, options);

  return (
    <div ref={$div}>
      {value && <LeafletProvider value={value}>{children}</LeafletProvider>}
    </div>
  );
};

export default Map;
