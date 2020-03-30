import React, { useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { antPath } from 'leaflet-ant-path';
import '../../../polylineoffset/index';
import { selectSwitchActorColor } from '../../../selectors/switch';
import PolylineOffset from '../../../polylineoffset/index';

export const AntPath: React.FC<{
  $l: React.MutableRefObject<any>;
  id: string;
  events: {
    event: any;
    latLng: {
      lat: number;
      lng: number;
    };
  }[];
  offset?: number;
  twoWay?: boolean;
  weight?: number;
}> = function({ id, $l, events, offset: jiggle, twoWay, weight = 5 }) {
  const color = useSelector(selectSwitchActorColor);
  const offset = useMemo(
    () =>
      jiggle !== undefined
        ? jiggle * weight + (twoWay ? weight / 2 : 0)
        : undefined,
    [jiggle, twoWay, weight]
  );
  const options = useMemo(
    () => ({
      color: color ? color(id) : '#6c757d',
      pulseColor: '#FFFFFF',
      pane: 'markerPane',
      opacity: 1,
      weight,
      offset,
      use: (path: any, options: any) => new PolylineOffset(path, options)
    }),
    [color, id, offset, weight]
  );
  const $antpath = useRef<any>();

  useEffect(() => {
    const antpath = antPath(
      _.map<
        {
          event: any;
          latLng: any;
        },
        [number, number]
      >(events, ({ latLng: { lat, lng } }) => [+lat!, +lng!]),
      options
    );
    $antpath.current = antpath;
    $l.current.addLayer(antpath);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer(antpath);
    };
    // ignoring options update
    // eslint-disable-next-line
  }, [events]);

  useEffect(() => {
    $antpath.current.setStyle(options);
  }, [options]);

  return null;
};
