import React, { useCallback } from 'react';
import { MarkerClusterGroup } from './MarkerClusterGroup';
import { createSelector } from '@reduxjs/toolkit';

import L from 'leaflet';
import 'leaflet.markercluster';

import { useSelector } from 'react-redux';
import {
  getLocalisation,
  NamedPlace,
  Actor,
  PrimaryKey,
  AnyEvent
} from '../../data';
import { selectMaskedEvents } from '../../selectors/mask';
import SipMarker from './SipMarker';
import _ from 'lodash';

const selectLocalisedEvents = createSelector(selectMaskedEvents, events =>
  _.transform(
    events,
    (acc, e) => {
      const l = getLocalisation(e);
      if (l !== null && l.lat && l.lng)
        acc.push({
          id: e.id,
          label: e.label,
          actor: e.actor.id,
          kind: e.kind,
          localisation: l
        });
    },
    [] as {
      localisation: NamedPlace;
      label: string;
      actor: Actor['id'];
      id: PrimaryKey;
      kind: AnyEvent['kind'];
    }[]
  )
);

/*export const SipMarkers: React.FC<{
  $map: React.MutableRefObject<Map>;
}> = function({ $map }) {
  const events = useSelector(selectLocalisedEvents);
  const createClusterIcon = useSelector(selectClusterIconFun);

  // return (
  //   <MarkerClusterGroup
  //     maxClusterRadius={50}
  //     zoomToBoundsOnClick={false}
  //     onclusterclick={onClusterClick}
  //     iconCreateFunction={createClusterIcon}
  //     animate={false}
  //     showCoverageOnHover={false}
  //     ref={handleClusterGroupRef}
  //     // TODO refresh clusters
  //   >
  //     {_.map(events, event => {
  //       return <SipMarker key={event.id} event={event} />;
  //     })}
  //   </MarkerClusterGroup>
  // );
};*/

export const SipMarkerClusterGroup: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $layer: React.MutableRefObject<any>;
}> = function({ $map, $layer }) {
  const events = useSelector(selectLocalisedEvents);

  const onClusterClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      const cluster = e.layer;
      let bottomCluster = cluster;
      let zoomLevel = cluster._zoom;
      while (bottomCluster._childClusters.length === 1) {
        bottomCluster = bottomCluster._childClusters[0];
        if (
          zoomLevel === cluster._zoom &&
          cluster._childCount !== bottomCluster._childCount
        ) {
          zoomLevel = bottomCluster._zoom;
        }
      }
      if (bottomCluster._childClusters.length > 1) {
        zoomLevel = bottomCluster._childClusters[0]._zoom;
      }
      if (
        bottomCluster._zoom === e.target._maxZoom &&
        bottomCluster._childCount === cluster._childCount
      ) {
        // All child markers are contained in a single cluster from this._maxZoom to this cluster.
        cluster.spiderfy();
      } else {
        $map.current.flyTo(cluster._cLatLng, zoomLevel);
      }
    },
    [$map]
  );
  const getMarkers = useCallback(
    (ref: React.MutableRefObject<L.MarkerClusterGroup>) => {
      return _.map(events, event => (
        <SipMarker $l={ref} key={event.id} event={event} />
      ));
    },
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
        removeOutsideVisibleBounds: true
      }}
      onClusterClick={onClusterClick}
      // refreshCluster={refreshCluster}
    />
  );
};

export default SipMarkerClusterGroup;
