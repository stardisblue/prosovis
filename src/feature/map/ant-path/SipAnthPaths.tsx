import React, { useMemo, useState, useReducer } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import _ from 'lodash';
import { AntPath } from './AntPath';
import { PayloadAction } from '@reduxjs/toolkit';
import * as d3 from 'd3-array';
import useLazyRef from '../../../hooks/useLazyRef';

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
  const $group = useLazyRef<L.LayerGroup<any>>(() =>
    L.layerGroup(undefined, { pane: 'markerPane' })
  );

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

    map.on('zoomend', handleZoom);
    map.on('sip-marker', handleMarkerAdd);
    map.on('sip-marker-off', handleMarkerRemove);

    return () => {
      map.off('zoomend', handleZoom);
      map.off('sip-marker', handleMarkerAdd);
      map.off('sip-marker-off', handleMarkerRemove);
    };
    // safely disabling $map and initialMarkerSet
    // eslint-disable-next-line
  }, []);

  const chens = useMemo(
    () =>
      _(markers)
        .map(marker => ({
          // extracting current cluster or marker position and id
          event: marker.options,
          ...getMarkerLatLng(marker, zoom)
        }))
        .groupBy('event.actor') // grouping by actors
        .mapValues((
          events // chaining values
        ) =>
          // 1. get first element in a cluster
          _(events)
            .sortBy(({ event }) => _.first<any>(event.dates).clean_date)
            .sortedUniqBy('groupId')
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
            .thru<
              [
                { groupId: any; latLng: any; event: any },
                { groupId: any; latLng: any; event: any }
              ][]
            >(d3.pairs) //, ([, last], [first]) => [last, first]))
            .value()
        )
        // 5. we obtain a chain for each actor
        .value(),
    [zoom, markers]
  );

  const reference = useMemo(
    function() {
      const flatChens = _(chens)
        .flatMap(v => v)
        .sortBy(([, { event }]) => _.first<any>(event.dates).clean_date)
        .value();

      const total = _(flatChens)
        .map(v => _.map(v, 'groupId'))
        .keyBy(v => v.join(':'))
        .mapValues(
          (ids, _key, reference) =>
            reference[[...ids].reverse().join(':')] !== undefined
        )
        .value();

      const offset = _(flatChens)
        .groupBy(v =>
          _(v)
            .map('groupId')
            .join(':')
        )
        .mapValues(chen =>
          _(chen)
            .map((segment, i) => [_.map(segment, 'event.id').join(':'), i])
            .value()
        )
        .flatMap(v => v)
        .fromPairs()
        .value();

      return { offset, total };
    },
    [chens]
  );

  return (
    <>
      {/* {_.map(groups, (events, key) => (
        <AntPath key={key} id={key} $l={$group} events={events} />
      ))} */}
      {_.map(chens, (chen, key) => (
        <ActorPath key={key} id={key} $l={$group} chain={chen} {...reference} />
      ))}
    </>
  );
};

export const ActorPath: React.FC<any> = function({ $l, chain, offset, total }) {
  return (
    <>
      {_.map(chain, segment => {
        const key = _.map(segment, 'event.id').join(':');
        const grp = _.map(segment, 'groupId').join(':');
        return (
          <AntPath
            key={key}
            id={key}
            $l={$l}
            events={segment}
            offset={offset[key]}
            twoWay={total[grp]}
          />
        );
      })}
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
