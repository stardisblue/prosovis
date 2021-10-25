import React, { useMemo, useState, useReducer } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import useLazyRef from '../../../hooks/useLazyRef';
import { ActorPath } from './ActorPath';
import { AntPathEvent } from './AntPath';
import { flatify, simplify, segmentify, PathSegment } from './path-maker';
import {
  keyBy,
  map,
  pickBy,
  flow,
  groupBy,
  mapValues,
  flatMap,
  sortBy,
  filter,
  pipe,
  join,
  fromPairs,
  reverse,
  identity,
} from 'lodash/fp';
import { map as _map } from 'lodash';
import { DataMarkerOptions, DataMarkerType } from '../marker/Marker';

const markerReducer = function (
  state: _.Dictionary<DataMarkerType>,
  action: PayloadAction<any>
) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return { ...state, [action.payload.options.id]: action.payload };
    case 'remove':
      return pickBy((_value, key) => {
        // weak equal to mitigate issues between number and string
        return key !== action.payload.options.id.toString();
      }, state);
    default:
      throw new Error();
  }
};

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $l: React.MutableRefObject<any>;
  defaultMarkerSet: React.MutableRefObject<any[]>;
}> = function ({ $map, $l, defaultMarkerSet }) {
  const $group = useLazyRef<L.LayerGroup<any>>(() => L.layerGroup());

  useEffect(function () {
    $l.current.addLayer($group.current);
    return function () {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer($group.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const [markers, dispatch] = useReducer(markerReducer, {});
  const [zoom, setZoom] = useState(() => $map.current.getZoom());

  useEffect(() => {
    const map = $map.current;

    dispatch({
      type: 'set',
      payload: keyBy('options.id', defaultMarkerSet.current),
    });

    const handleZoom = () => setZoom(map.getZoom());

    const handleMarkerAdd = (e: any) =>
      dispatch({ type: 'add', payload: e.current });

    const handleMarkerRemove = (e: any) =>
      dispatch({ type: 'remove', payload: e.current });

    map.on({
      zoomend: handleZoom,
      'sip-marker': handleMarkerAdd,
      'sip-marker-off': handleMarkerRemove,
    } as any);

    return () => {
      map.off({
        zoomend: handleZoom,
        'sip-marker': handleMarkerAdd,
        'sip-marker-off': handleMarkerRemove,
      } as any);
    };
    // safely disabling $map and initialMarkerSet
    // eslint-disable-next-line
  }, []);

  const { chens, offset, total } = useMemo(() => {
    const chens: _.Dictionary<{
      markers: DataMarkerOptions[];
      chain: PathSegment<DataMarkerOptions>[];
    }> = flow(
      map(
        (marker: DataMarkerType) =>
          ({
            // extracting current cluster or marker position and id
            options: marker.options,
            ...getMarkerLatLng(marker, zoom),
          } as AntPathEvent<DataMarkerOptions>)
      ),
      groupBy('options.actor.id'),
      mapValues(
        // chaining values
        (markers: AntPathEvent<DataMarkerOptions>[]) => ({
          markers: map('options', markers),
          chain: flow(flatify, simplify, segmentify)(markers),
        })
      )
    )(markers); // 5. we obtain a chain for each actor

    const flatChens = flow(
      flatMap('chain'),
      filter<PathSegment<DataMarkerOptions>>(
        'segment.1.options.event.datation.0.value'
      ),
      sortBy<PathSegment<DataMarkerOptions>>(
        'segment.1.options.event.datation.0.value'
      )
    )(chens);

    const offset: _.Dictionary<number> = pipe(
      groupBy<PathSegment<DataMarkerOptions>>(
        pipe((v) => v.segment, map('groupId'), join(':'))
      ),
      mapValues(
        (chain: PathSegment<DataMarkerOptions>[]) =>
          chain.map(({ segment }, i) => [
            pipe(map('options.id'), join(':'))(segment),
            i,
          ]) as [string, number][]
      ),
      flatMap(identity),
      fromPairs
    )(flatChens);

    const total = pipe(
      map(({ segment }: PathSegment<DataMarkerOptions>) =>
        map('groupId', segment)
      ),
      keyBy((ids: string[]) => ids.join(':')),
      (values) =>
        mapValues((ids) => values[reverse(ids).join(':')] !== undefined, values)
    )(flatChens);

    return { chens, offset, total };
  }, [zoom, markers]);
  return (
    <>
      {_map(chens, ({ chain, markers }, key) => (
        <ActorPath
          key={key}
          id={'' + key}
          $l={$group}
          chain={chain}
          events={markers}
          offset={offset}
          total={total}
        />
      ))}
    </>
  );
};

export default SipAnthPaths;

export function getMarkerLatLng(marker: any, zoom: number) {
  let cluster = marker.__parent;
  if (!cluster || cluster._zoom < zoom) {
    return { groupId: marker._leaflet_id, latLng: marker.getLatLng() };
  }
  while (cluster._zoom === undefined || cluster._zoom > zoom) {
    cluster = cluster.__parent;
  }
  return { groupId: cluster._leaflet_id, latLng: cluster.getLatLng() };
}
