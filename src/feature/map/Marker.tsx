import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PrimaryKey } from '../../data';

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
  options: { id: null, kind: null, actor: null }
}) as any) as DataMarkerType;

export const Marker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  latlng: L.LatLngExpression;
  options: L.CircleMarkerOptions & {
    id: PrimaryKey;
    kind: string;
    actor: PrimaryKey;
  };
}> = function({ latlng, options, $l }) {
  const marker = useRef<DataMarkerType>();
  useEffect(function() {
    marker.current = new DataMarker(latlng, options);
    // const marker = L.circleMarker(latlng, {fillColor: color.main()});
    $l.current.addLayer(marker.current);
    return function() {
      // eslint-disable-next-line
      $l.current.removeLayer(marker.current!);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    function() {
      if (marker.current)
        marker.current.setStyle({
          color: options.color,
          fillColor: options.fillColor
        });
    },
    [options.color, options.fillColor]
  );
  return null;
};
