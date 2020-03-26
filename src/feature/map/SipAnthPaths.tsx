import React, { useMemo, useRef, useState, useReducer } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLocalisedEvents } from './selectLocalisedEvents';
import _ from 'lodash';
import { AntPath } from './AntPath';
import { PayloadAction } from '@reduxjs/toolkit';

const markerReducer = function(state: any, action: PayloadAction<any>) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return { ...state, [action.payload.options.id]: action.payload };
    case 'remove':
      return _.pickBy(state, (_value, key) => {
        // weak equal to mitigate issues between number and string
        return key != action.payload.options.id;
      });
    default:
      throw new Error();
  }
};

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
  clusterRef: React.MutableRefObject<any>;
  initialMarkerSet: React.MutableRefObject<any[]>;
}> = function({ $map, $layer, clusterRef, initialMarkerSet }) {
  const groupLayer = useRef<any>();
  if (groupLayer.current === undefined) {
    groupLayer.current = L.layerGroup(undefined, { pane: 'markerPane' });
  }
  useEffect(function() {
    $layer.current.addLayer(groupLayer.current);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $layer.current.removeLayer(groupLayer.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const [markers, dispatch] = useReducer(markerReducer, {});
  const [zoom, setZoom] = useState($map.current.getZoom());

  useEffect(() => {
    dispatch({
      type: 'set',
      payload: _(initialMarkerSet.current)
        .keyBy('options.id')
        .value()
    });

    $map.current.on('zoomend', e => {
      setZoom($map.current.getZoom());
    });

    $map.current.on('sip-marker', (e: any) => {
      dispatch({ type: 'add', payload: e.current });
    });

    $map.current.on('sip-marker-off', (e: any) => {
      dispatch({ type: 'remove', payload: e.current });
    });
    // safely disabling $map and clusterRef
    // eslint-disable-next-line
  }, []);

  const groups = useMemo(() => {
    return _(markers)
      .orderBy('datation[0].clean_date')
      .map(marker => ({
        event: marker.options,
        latLng: getmarkerLatLng(marker, zoom)
      }))
      .groupBy('event.actor')
      .mapValues(p =>
        _.sortedUniqBy(p, ({ latLng: { lat, lng } }) => lat + ':' + lng)
      )
      .value();
  }, [markers, zoom]);
  return (
    <>
      {_.map(groups, (events, key) => (
        <AntPath key={key} id={key} $layer={groupLayer} events={events} />
      ))}
    </>
  );
};

// alpha lors de la selection
// ou survol,
// survol/ selection d'un acteur sur information
// survol acteur dans timeline

export default SipAnthPaths;

function getmarkerLatLng(marker: any, zoom: number) {
  let cluster = marker.__parent;
  if (!cluster || cluster._zoom < zoom) {
    return marker.getLatLng();
  }
  while (cluster._zoom === undefined || cluster._zoom > zoom) {
    cluster = cluster.__parent;
  }
  return cluster.getLatLng();
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
