import React, { useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLocalisedEvents } from './selectLocalisedEvents';
import _ from 'lodash';
import { antPath } from 'leaflet-ant-path';
import { selectSwitchActorColor } from '../../selectors/switch';

const AntPath: React.FC<{
  $layer: React.MutableRefObject<any>;
  id: string;
  events: { event: any; latLng: { lat: number; lng: number } }[];
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
        { event: any; latLng: { lat: number; lng: number } },
        [number, number]
      >(events, ({ latLng: { lat, lng } }) => [+lat!, +lng!]),
      options
    );
  }

  useEffect(() => {
    const path = antPath(
      _.map<{ event: any; latLng: any }, [number, number]>(
        events,
        ({ latLng: { lat, lng } }) => [+lat!, +lng!]
      ),
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

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
  clusterRef: React.MutableRefObject<any>;
}> = function({ $map, $layer, clusterRef }) {
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

  const events = useSelector(selectLocalisedEvents);
  const [markers, setMarkers] = useState<any>();

  useEffect(() => {
    $map.current.on('zoomend', e => {
      const zoom = $map.current.getZoom();
      const ms = _(clusterRef.current.getLayers())
        .map(marker => {
          let cluster = marker.__parent;
          // console.log(marker, cluster);
          if (!cluster || cluster._zoom < zoom) {
            return [marker.options.id, marker.getLatLng()];
          }
          while (cluster._zoom === undefined || cluster._zoom > zoom) {
            cluster = cluster.__parent;
          }
          return [marker.options.id, cluster.getLatLng()];
        })
        .fromPairs()
        .value();
      setMarkers(ms);
    });
    // safely disabling $map and clusterRef
    // eslint-disable-next-line
  }, []);
  const groups = useMemo(() => {
    return _(events)
      .orderBy('datation.clean_date')
      .map(e => ({
        event: e,
        latLng: (markers && markers[e.id]) || e.localisation
      }))
      .groupBy('event.actor')
      .mapValues(p =>
        _.sortedUniqBy(p, ({ latLng: { lat, lng } }) => lat + ':' + lng)
      )
      .value();
  }, [events, markers]);
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
