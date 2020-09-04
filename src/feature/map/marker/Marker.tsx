import React, { useEffect } from 'react';
import L from 'leaflet';
import { PrimaryKey } from '../../../data/typings';
import useLazyRef from '../../../hooks/useLazyRef';

type DataMarkerOptions = L.CircleMarkerOptions & {
  id: PrimaryKey;
  kind: string;
  actor: PrimaryKey;
};
interface DataMarkerType extends L.CircleMarker {
  new (latlng: L.LatLngExpression, options?: DataMarkerOptions): DataMarkerType;

  options: DataMarkerOptions;
}

const DataMarker = (L.CircleMarker.extend({
  options: { id: null, kind: null, actor: null },
}) as any) as DataMarkerType;

export const Marker: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $l: React.MutableRefObject<L.LayerGroup>;
  latlng: L.LatLngExpression;
  options: L.CircleMarkerOptions & {
    id: PrimaryKey;
    kind: string;
    actor: PrimaryKey;
    dates: any[];
  };
  onMouseOver?: L.LeafletEventHandlerFn;
  onMouseOut?: L.LeafletEventHandlerFn;
  onClick?: L.LeafletEventHandlerFn;
  onMarkerAdd?: (marker: DataMarkerType) => void;
  onMarkerRemove?: (marker: DataMarkerType) => void;
}> = function ({
  latlng,
  options,
  $l,
  $map,
  onMouseOut,
  onMouseOver,
  onClick,
}) {
  const marker = useLazyRef(() => new DataMarker(latlng, options));

  useEffect(function () {
    // const marker = L.circleMarker(latlng, {fillColor: color.main()});
    $l.current.addLayer(marker.current);
    $map.current.fire('sip-marker', { current: marker.current }, true);
    return function () {
      // eslint-disable-next-line
      $l.current.removeLayer(marker.current);
      // eslint-disable-next-line
      $map.current.fire('sip-marker-off', { current: marker.current }, true);
    };
    // eslint-disable-next-line
  }, []);

  useColor(marker, options.color, options.fillColor);

  useFillOpacity(marker, options.fillOpacity);

  useHover(marker, onMouseOver, onMouseOut);

  useClick(marker, onClick);

  return null;
};
function useColor(
  marker: React.MutableRefObject<DataMarkerType>,
  color?: string,
  fillColor?: string
) {
  useEffect(
    function () {
      marker.current.setStyle({ color, fillColor });
    }, // safely ignoring marker
    // eslint-disable-next-line
    [color, fillColor]
  );
}

function useFillOpacity(
  marker: React.MutableRefObject<DataMarkerType>,
  fillOpacity?: number
) {
  useEffect(
    function () {
      marker.current.setStyle({ fillOpacity });
    }, // safely ignoring marker
    // eslint-disable-next-line
    [fillOpacity]
  );
}

function useHover(
  marker: React.MutableRefObject<DataMarkerType>,
  onMouseOver?: L.LeafletEventHandlerFn,
  onMouseOut?: L.LeafletEventHandlerFn
) {
  useEffect(
    function () {
      if (onMouseOver !== undefined) {
        marker.current.on('mouseover', onMouseOver);
        return function () {
          // marker.current does not change
          // eslint-disable-next-line
          marker.current.off('mouseover');
        };
      }
    }, // safely ignoring marker
    // eslint-disable-next-line
    [onMouseOver]
  );

  useEffect(
    function () {
      if (onMouseOut !== undefined) {
        marker.current.on('mouseout', onMouseOut);
        return function () {
          // marker.current does not change
          // eslint-disable-next-line
          marker.current.off('mouseout');
        };
      }
    }, // safely ignoring marker
    // eslint-disable-next-line
    [onMouseOut]
  );
}

function useClick(
  marker: React.MutableRefObject<DataMarkerType>,
  onMouseClick?: L.LeafletEventHandlerFn
) {
  useEffect(
    function () {
      if (onMouseClick !== undefined) {
        marker.current.on('click', onMouseClick);

        return function () {
          // marker.current does not change
          // eslint-disable-next-line
          marker.current.off('click');
        };
      }
    }, // safely ignoring marker
    // eslint-disable-next-line
    [onMouseClick]
  );
}
