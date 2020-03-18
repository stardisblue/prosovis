import React, { useEffect } from 'react';
import L from 'leaflet';
import { PrimaryKey } from '../../data';
import { useLazyRef } from '../../hooks/useLazyRef';

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
  const marker = useLazyRef(() => new DataMarker(latlng, options));
  useEffect(function() {
    // marker.current = new DataMarker(latlng, options);
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
      marker.current.setStyle({
        color: options.color,
        fillColor: options.fillColor
      });
    },
    [options.color, options.fillColor]
  );

  useEffect(
    function() {
      marker.current.setStyle({
        fillOpacity: options.fillOpacity
      });
    },
    [options.fillOpacity]
  );
  return null;
};
