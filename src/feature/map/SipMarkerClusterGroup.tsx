import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MarkerClusterGroup } from './MarkerClusterGroup';
import { createSelector } from '@reduxjs/toolkit';

import L from 'leaflet';
import 'leaflet.markercluster';

import * as d3 from 'd3';

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
import { selectSwitch } from '../../reducers/switchSlice';
import { selectMainColor, selectActorColor } from '../../selectors/color';
import PieChart from './PieChart';
import ReactDOM from 'react-dom';

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

const scale = d3.scaleSqrt().range([5, 10]);

const selectClusterIconFun = createSelector(
  selectSwitch,
  selectMainColor,
  selectActorColor,
  (switcher, main, actor) => {
    const countBy = switcher === 'Actor' ? 'options.actor' : 'options.kind';
    const color = switcher === 'Actor' ? actor : main;

    return function(cluster: L.MarkerCluster) {
      const markers = cluster.getAllChildMarkers();
      const donut = 0;
      const radius = scale(markers.length);
      const size = (radius + donut) * 2;

      const counts = _(markers)
        .countBy(countBy)
        .toPairs()
        .value();

      if (!(cluster as any)._react) {
        (cluster as any)._react = d3.create('svg').node() as any;
      }
      const dom = (cluster as any)._react;
      d3.select(dom)
        .attr('width', size)
        .attr('height', size)
        .attr('viewBox', [-donut - radius, -donut - radius, size, size] as any);

      ReactDOM.render(
        <PieChart
          radius={radius}
          counts={counts}
          color={color}
          donut={donut}
        />,
        dom
      );

      return L.divIcon({
        html: dom as any,
        className: '',
        iconSize: L.point(size, size)
      });
    };
  }
);

export const SipMarkerClusterGroup: React.FC<{
  $l: React.MutableRefObject<L.Map>;
}> = function({ $l }) {
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
        $l.current.flyTo(cluster._cLatLng, zoomLevel);
      }
    },
    [$l]
  );

  const iconCreateFunction = useSelector(selectClusterIconFun);
  const [refreshCluster, setRefreshCluster] = useState(
    () => iconCreateFunction
  );

  useEffect(
    function() {
      iconCreateRef.current = iconCreateFunction;
      setRefreshCluster(() => iconCreateFunction);
    },
    [iconCreateFunction]
  );

  const iconCreateRef = useRef(iconCreateFunction);
  const iconCreateFix = useRef(function(cluster: L.MarkerCluster) {
    return iconCreateRef.current(cluster);
  });

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
      $l={$l}
      markers={getMarkers}
      options={{
        animate: false,
        maxClusterRadius: 50,
        zoomToBoundsOnClick: false,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        iconCreateFunction: iconCreateFix.current
      }}
      onClusterClick={onClusterClick}
      refreshCluster={refreshCluster}
    />
  );
};

export default SipMarkerClusterGroup;
