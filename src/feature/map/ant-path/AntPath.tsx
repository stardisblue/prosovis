import React, { useRef } from 'react';
import { useEffect } from 'react';
import { antPath } from 'leaflet-ant-path';
import '../../../polylineoffset/index';
import PolylineOffset from '../../../polylineoffset/index';
import { useSelector } from 'react-redux';
import { superSelectionAsMap } from '../../../selectors/superHighlights';
import { isEmpty, map, some } from 'lodash/fp';

export type AntPathEvent<T = { id: string; [k: string]: any }> = {
  options: T;
  groupId: any;
  latLng: L.LatLng;
};

export const AntPath: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  id: string;
  events: AntPathEvent[];
  color?: string;
  offset?: number;
  twoWay?: boolean;
  weight?: number;
  dashArray?: string | number[];
  delay?: number;
}> = function ({
  $l,
  events,
  offset,
  twoWay,
  color,
  weight = 5,
  dashArray = [2, 12],
  delay = 400,
}) {
  const $antpath = useRef<any>();

  useEffect(() => {
    const antpath = antPath([], {
      pulseColor: '#FFFFFF',
      lineCap: 'butt',
      dashArray,
      delay,
      use: (path: any, options: any) => new PolylineOffset(path, options),
    });
    $antpath.current = antpath;
    $l.current.addLayer(antpath);

    return () => {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer(antpath);
    };
    // ignoring options update
    // eslint-disable-next-line
  }, []);

  const selected = useSelector(superSelectionAsMap);

  // update path
  useEffect(() => {
    $antpath.current.setLatLngs(map('latLng', events));
  }, [events]);

  // update color
  useEffect(() => {
    $antpath.current.setStyle({ color });
  }, [color]);

  // update weight
  useEffect(() => {
    $antpath.current.setStyle({ weight: weight - 1 });
  }, [weight]);

  useEffect(() => {
    $antpath.current.setStyle({ dashArray });
  }, [dashArray]);

  useEffect(() => {
    $antpath.current.setStyle({ delay });
  }, [delay]);

  // update opacity
  useEffect(() => {
    $antpath.current.setStyle({
      opacity:
        isEmpty(selected) ||
        some(({ options: { id } }) => selected[id] !== undefined, events)
          ? undefined
          : 0.3,
    });
  }, [selected, events]);

  // update offset
  useEffect(() => {
    $antpath.current.setStyle({
      offset:
        offset !== undefined
          ? offset * weight + (twoWay ? weight / 2 : 0)
          : undefined,
    });
    $antpath.current.redraw();
  }, [offset, twoWay, weight]);

  return null;
};
