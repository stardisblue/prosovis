import React, { useMemo, useState, useReducer, useRef } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import _ from 'lodash';
import { PayloadAction } from '@reduxjs/toolkit';
import * as d3 from 'd3-array';
import useLazyRef from '../../../hooks/useLazyRef';
import { ActorPath } from './ActorPath';
import { AntPathEvent } from './AntPath';
import moment from 'moment';

const markerReducer = function(state: any, action: PayloadAction<any>) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return { ...state, [action.payload.options.id]: action.payload };
    case 'remove':
      return _.pickBy(state, (_value, key) => {
        // weak equal to mitigate issues between number and string
        return key !== action.payload.options.id.toString();
      });
    default:
      throw new Error();
  }
};

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $l: React.MutableRefObject<any>;
  defaultMarkerSet: React.MutableRefObject<any[]>;
}> = function({ $map, $l, defaultMarkerSet }) {
  const $group = useLazyRef<L.LayerGroup<any>>(() => L.layerGroup());
  const $hover = useRef<any>(null);

  useEffect(function() {
    $l.current.addLayer($group.current);
    return function() {
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
      payload: _(defaultMarkerSet.current)
        .keyBy('options.id')
        .value()
    });

    const handleZoom = () => setZoom(map.getZoom());

    const handleMarkerAdd = (e: any) =>
      dispatch({ type: 'add', payload: e.current });

    const handleMarkerRemove = (e: any) =>
      dispatch({ type: 'remove', payload: e.current });

    map.on({
      zoomend: handleZoom,
      'sip-marker': handleMarkerAdd,
      'sip-marker-off': handleMarkerRemove
    } as any);

    return () => {
      map.off({
        zoomend: handleZoom,
        'sip-marker': handleMarkerAdd,
        'sip-marker-off': handleMarkerRemove
      } as any);
    };
    // safely disabling $map and initialMarkerSet
    // eslint-disable-next-line
  }, []);

  const { chens, offset, total } = useMemo(() => {
    const chens = _(markers)
      .map<AntPathEvent>(marker => ({
        // extracting current cluster or marker position and id
        event: marker.options,
        ...getMarkerLatLng(marker, zoom)
      }))
      .groupBy('event.actor') // grouping by actors
      .mapValues((
        events // chaining values
      ) =>
        // 1. get first element in a cluster
        ({
          events: _.map(events, 'event'),
          chain: _(events)
            .sortBy(({ event }) => _.first<any>(event.dates).clean_date)
            .sortedUniqBy('groupId')
            .thru<[AntPathEvent, AntPathEvent][]>(d3.pairs) //, ([, last], [first]) => [last, first]))
            .map(segment => {
              const [
                {
                  event: {
                    dates: [f]
                  }
                },
                {
                  event: {
                    dates: [l]
                  }
                }
              ] = segment;
              const [p1, p2] = _.map(segment, v =>
                $map.current.latLngToLayerPoint(v.latLng)
              );
              return {
                segment,
                diff: moment(l.clean_date).diff(f.clean_date, 'years', true),
                dist: p1.distanceTo(p2)
              };
            })
            .value()
        })
      )
      // 5. we obtain a chain for each actor
      .value();

    const flatChens = _(chens)
      .flatMap(({ chain }) => chain)
      .sortBy(
        ({ segment: [, { event }] }) => _.first<any>(event.dates).clean_date
      )
      .value();

    const extent = _(flatChens)
      .map(
        ({
          segment: [
            {
              event: {
                dates: [f]
              }
            },
            {
              event: {
                dates: [l]
              }
            }
          ]
        }) => moment(l.clean_date).diff(f.clean_date, 'years', true)
      )
      .max();
    console.log(extent);

    const offset = _(flatChens)
      .groupBy(chain =>
        _(chain.segment)
          .map('groupId')
          .join(':')
      )
      .mapValues(chain =>
        _(chain)
          .map((chen, i) => [_.map(chen.segment, 'event.id').join(':'), i])
          .value()
      )
      .flatMap(v => v)
      .fromPairs()
      .value();

    const total = _(flatChens)
      .map(({ segment }) => _.map(segment, 'groupId'))
      .keyBy(ids => ids.join(':'))
      .mapValues(
        (ids, _key, reference) =>
          reference[[...ids].reverse().join(':')] !== undefined
      )
      .value();
    return { chens, offset, total };
    // disabling $map ref
    //eslint-disable-next-line
  }, [zoom, markers]);
  return (
    <>
      {_.map(chens, ({ chain, events }, key) => (
        <ActorPath
          key={key}
          id={key}
          $l={$group}
          $hover={$hover}
          chain={chain}
          events={events}
          offset={offset}
          total={total}
        />
      ))}
    </>
  );
};

// alpha lors de la selection
// ou survol,
// survol/ selection d'un acteur sur information
// survol acteur dans timeline

export default SipAnthPaths;

function getMarkerLatLng(marker: any, zoom: number) {
  let cluster = marker.__parent;
  if (!cluster || cluster._zoom < zoom) {
    return { groupId: marker._leaflet_id, latLng: marker.getLatLng() };
  }
  while (cluster._zoom === undefined || cluster._zoom > zoom) {
    cluster = cluster.__parent;
  }
  return { groupId: cluster._leaflet_id, latLng: cluster.getLatLng() };
}
// ! UNUSED
// _(clusterRef.current.getLayers())
//   .map(marker => {
//     let cluster = marker.__parent;
//     while (cluster._zoom === undefined || cluster._zoom > zoom) {
//       cluster = cluster.__parent;
//     }
//     return {
//       marker,
//       groupId: cluster._leaflet_id,
//       latLng: cluster.getLatLng()
//     };
//   })
//   .groupBy('groupId')
//   .mapValues(markers => ({
//     markers: _(markers)
//       .map('marker.options.id')
//       .value(),
//     id: markers[0].groupId,
//     latLng: markers[0].latLng
//   }))
//   .value()

//! UNUSED
// 3. zip them together :)
// .zip(
//   // 2. get last element in a cluster
//   _(events)
//     .orderBy(
//       ({ event }) => _.last<any>(event.dates).clean_date,
//       'desc'
//     )
//     .sortedUniqBy('groupId')
//     .reverse()
//     .value()
// )
// 4. chain them together \o/
