import React, { useState, useRef, useEffect } from 'react';
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
  onMoveEnd?: L.LeafletEventHandlerFn;
}> = function ({ defaultBounds, options, children, onMoveEnd }) {
  const $div = useRef(null as any);

  const value = useLeafletMap($div, defaultBounds, options);

  useEffect(() => {
    if (value && onMoveEnd) {
      const map = value.top;
      map.on('moveend', onMoveEnd);

      return () => {
        map.off('moveend');
      };
    }
  }, [onMoveEnd, value]);

  return (
    <div ref={$div}>
      {value && <LeafletProvider value={value}>{children}</LeafletProvider>}
    </div>
  );
};

export default Map;
