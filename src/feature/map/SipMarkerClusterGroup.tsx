import React, { useCallback } from 'react';
import { MarkerClusterGroup } from './MarkerClusterGroup';

import L from 'leaflet';
import 'leaflet.markercluster';

import { useSelector } from 'react-redux';
import SipMarker from './SipMarker';
import _ from 'lodash';
import { selectLocalisedEvents } from './selectLocalisedEvents';

export const SipMarkerClusterGroup: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
  fRef: any;
}> = function({ $map, $layer, fRef }) {
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
      return _.map(events, event => (
        <SipMarker $map={$map} $l={ref} key={event.id} event={event} />
      ));
    },
    [events]
  );

  return (
    <MarkerClusterGroup
      fRef={fRef}
      $l={$layer}
      markers={getMarkers}
      options={{
        animate: false,
        maxClusterRadius: 50,
        zoomToBoundsOnClick: false,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        spiderfyOnMaxZoom: false
      }}
    />
  );
};

export default SipMarkerClusterGroup;
