import React, { useCallback } from 'react';
import { MarkerClusterGroup } from './MarkerClusterGroup';

import L from 'leaflet';
import 'leaflet.markercluster';

import { useSelector } from 'react-redux';
import SipMarker from '../marker/SipMarker';
import _ from 'lodash';
import { selectLocalisedEvents } from '../selectLocalisedEvents';

export const SipMarkerClusterGroup: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
}> = function ({ $map, $layer }) {
  const events = useSelector(selectLocalisedEvents);

  // const onClusterClick = useCallback(
  //   (e: L.LeafletMouseEvent) => {
  //     const cluster = e.layer;
  //     let bottomCluster = cluster;
  //     let zoomLevel = cluster._zoom;
  //     while (bottomCluster._childClusters.length === 1) {
  //       bottomCluster = bottomCluster._childClusters[0];
  //       if (
  //         zoomLevel === cluster._zoom &&
  //         cluster._childCount !== bottomCluster._childCount
  //       ) {
  //         zoomLevel = bottomCluster._zoom;
  //       }
  //     }
  //     if (bottomCluster._childClusters.length > 1) {
  //       zoomLevel = bottomCluster._childClusters[0]._zoom;
  //     }
  //     if (
  //       bottomCluster._zoom === e.target._maxZoom &&
  //       bottomCluster._childCount === cluster._childCount
  //     ) {
  //       // All child markers are contained in a single cluster from this._maxZoom to this cluster.
  //       cluster.spiderfy();
  //     } else {
  //       $map.current.flyTo(cluster._cLatLng, zoomLevel);
  //     }
  //   },
  //   [$map]
  // );

  const getMarkers = useCallback(
    (ref: React.MutableRefObject<L.MarkerClusterGroup>) => {
      return _.map(events, (event) => (
        <SipMarker $map={$map} $l={ref} key={event.event.id} event={event} />
      ));
    },
    // safely disabling $map ref
    // eslint-disable-next-line
    [events]
  );

  return (
    <MarkerClusterGroup
      $l={$layer}
      markers={getMarkers}
      options={{
        animate: false,
        maxClusterRadius: 50,
        zoomToBoundsOnClick: false,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        spiderfyOnMaxZoom: false,
      }}
    />
  );
};

export default SipMarkerClusterGroup;
