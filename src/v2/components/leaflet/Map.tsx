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
  onZoomEnd?: L.LeafletEventHandlerFn;
  mappy?: (map: L.Map) => void;
}> = function ({
  defaultBounds,
  options,
  children,
  onMoveEnd,
  onZoomEnd,
  mappy,
}) {
  const $div = useRef(null as any);

  const value = useLeafletMap($div, defaultBounds, options);

  useEffect(() => {
    if (value && mappy) mappy(value.top);
  }, [mappy, value]);
  useEffect(() => {
    if (value && onZoomEnd) {
      const map = value.top;
      map.on('zoomend', onZoomEnd);

      return () => {
        map.off('zoomend');
      };
    }
  }, [onZoomEnd, value]);

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
