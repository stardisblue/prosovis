import React, { useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { antPath } from 'leaflet-ant-path';
import { selectSwitchActorColor } from '../../selectors/switch';

export const AntPath: React.FC<{
  $layer: React.MutableRefObject<any>;
  id: string;
  events: {
    event: any;
    latLng: {
      lat: number;
      lng: number;
    };
  }[];
}> = function({ id, $layer, events }) {
  const color = useSelector(selectSwitchActorColor);
  const options = useMemo(
    () => ({
      color: color ? color(id) : '#6c757d',
      pulseColor: '#FFFFFF',
      pane: 'markerPane',
      opacity: 1
    }),
    [color, id]
  );
  const $path = useRef<any>();
  if ($path.current === undefined) {
    $path.current = antPath(
      _.map<
        {
          event: any;
          latLng: {
            lat: number;
            lng: number;
          };
        },
        [number, number]
      >(events, ({ latLng: { lat, lng } }) => [+lat!, +lng!]),
      options
    );
  }
  useEffect(() => {
    const path = antPath(
      _.map<
        {
          event: any;
          latLng: any;
        },
        [number, number]
      >(events, ({ latLng: { lat, lng } }) => [+lat!, +lng!]),
      options
    );
    $path.current = path;
    $layer.current.addLayer(path);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $layer.current.removeLayer(path);
    };
    // ignoring options update
    // eslint-disable-next-line
  }, [events]);
  useEffect(() => {
    $path.current.setStyle(options);
  }, [options]);
  return null;
};
