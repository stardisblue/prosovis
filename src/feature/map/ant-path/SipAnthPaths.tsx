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
} from 'lodash/fp';
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
    const chens: {
      events: DataMarkerOptions[];
      chain: PathSegment<DataMarkerOptions>[];
    }[] = flow(
      map(
        (marker: DataMarkerType) =>
          ({
            // extracting current cluster or marker position and id
            event: marker.options,
            ...getMarkerLatLng(marker, zoom),
          } as AntPathEvent<DataMarkerOptions>)
      ),
      groupBy('event.actor'),
      mapValues(
        (
          events: AntPathEvent<DataMarkerOptions>[] // chaining values
        ) =>
          ({
            events: map('event', events),
            chain: flow(flatify, simplify, segmentify)(events),
            // chain: _.flow(flatify, simplify, segmentify.bind($map.current))(events),
          } as {
            events: DataMarkerOptions[];
            chain: PathSegment<DataMarkerOptions>[];
          })
      )
    )(markers); // 5. we obtain a chain for each actor

    const flatChens = flow(
      flatMap('chain'),
      filter<PathSegment<DataMarkerOptions>>('segment.1.event.dates.0.value'),
      sortBy(
        ({ segment: [, { event }] }: PathSegment<DataMarkerOptions>) =>
          event.dates[0].value
      )
    )(chens);

    const offset: _.Dictionary<number> = pipe(
      groupBy<PathSegment<DataMarkerOptions>>(pipe(map('groupId'), join(':'))),
      mapValues((chain: PathSegment<DataMarkerOptions>[]) =>
        chain.map((chen, i) => [
          pipe(map('event.id'), join(':'))(chen.segment),
          i,
        ])
      ),
      flatMap,
      fromPairs
    )(flatChens);

    // const offset = _(flatChens)
    //   .groupBy((chain) => _(chain.segment).map('groupId').join(':'))
    //   .mapValues((chain) =>
    //     _(chain)
    //       .map((chen, i) => [_.map(chen.segment, 'event.id').join(':'), i])
    //       .value()
    //   )
    //   .flatMap()
    //   .fromPairs()
    //   .value();

    const total = pipe(
      map(({ segment }: PathSegment<DataMarkerOptions>) =>
        map('groupId', segment)
      ),
      keyBy((ids: string[]) => ids.join(':')),
      (values) =>
        mapValues((ids) => values[reverse(ids).join(':')] !== undefined, values)
    )(flatChens);

    // const total = _(flatChens)
    //   .map(({ segment }) => _.map(segment, 'groupId'))
    //   .keyBy((ids) => ids.join(':'))
    //   .mapValues(
    //     (ids, _key, reference) =>
    //       reference[[...ids].reverse().join(':')] !== undefined
    //   )
    //   .value();
    return { chens, offset, total };
    // disabling $map ref
    //eslint-disable-next-line
  }, [zoom, markers]);
  return (
    <>
      {Object.entries(chens).map(([key, { chain, events }]) => (
        <ActorPath
          key={key}
          id={'' + key}
          $l={$group}
          chain={chain}
          events={events}
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
