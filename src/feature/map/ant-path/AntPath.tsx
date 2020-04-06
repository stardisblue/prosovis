import React, { useRef } from 'react';
import { useEffect } from 'react';
import _ from 'lodash';
import { antPath } from 'leaflet-ant-path';
import '../../../polylineoffset/index';
import PolylineOffset from '../../../polylineoffset/index';
import { useSelector } from 'react-redux';
import { superSelectionAsMap } from '../../../selectors/superHighlights';

export type AntPathEvent = {
  event: { id: string; [k: string]: any };
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
}> = function({
  $l,
  events,
  offset,
  twoWay,
  color,
  weight = 5,
  dashArray = [2, 12],
  delay = 400
}) {
  const $antpath = useRef<any>();

  useEffect(() => {
    const antpath = antPath([], {
      pulseColor: '#FFFFFF',
      lineCap: 'butt',
      dashArray,
      delay,
      use: (path: any, options: any) => new PolylineOffset(path, options)
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
    $antpath.current.setLatLngs(_.map(events, 'latLng'));
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
        _.isEmpty(selected) ||
        _.some(events, ({ event: { id } }) => selected[id] !== undefined)
          ? undefined
          : 0.3
    });
  }, [selected, events]);

  // update offset
  useEffect(() => {
    $antpath.current.setStyle({
      offset:
        offset !== undefined
          ? offset * weight + (twoWay ? weight / 2 : 0)
          : undefined
    });
    $antpath.current.redraw();
  }, [offset, twoWay, weight]);

  return null;
};
