import _ from 'lodash';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { LayersControl, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLocalisation,
  PrimaryKey,
  NamedPlace,
  Actor,
  AnyEvent
} from '../../data';
import { clearHighlights, setHighlights } from '../../reducers/highlightSlice';
import { setSelection } from '../../reducers/selectionSlice';
import { selectMaskedEvents } from '../../selectors/mask';
import './SiprojurisMap.css';
import { setBoundsMask } from '../../reducers/maskSlice';
import { createSelector } from '@reduxjs/toolkit';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { selectMainColor } from '../../selectors/color';

export function SiprojurisMap() {
  const dispatch = useDispatch();

  const $map = useRef<Map>(null as any);
  const handleRef = useCallback(function(dom: Map) {
    if (!dom) return;
    $map.current = dom;
  }, []);

  useEffect(() => {
    // if ($map.current === null) return;
    //console.log($map.current.leafletElement.getBounds());

    $map.current.leafletElement.on('moveend', function() {
      const bounds = $map.current.leafletElement.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      dispatch(
        setBoundsMask([
          { lat: sw.lat, lng: sw.lng },
          { lat: ne.lat, lng: ne.lng }
        ])
      );
    });
  }, [dispatch]);

  return (
    <Map
      bounds={[
        [48.853333, 2.348611],
        [46.5691, 0.348203]
      ]}
      ref={handleRef}
      maxZoom={15}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Markers" checked>
          <SipMarkers $map={$map} />
        </LayersControl.Overlay>

        {/* <LayersControl.Overlay name="AntPaths" checked></LayersControl.Overlay> */}
      </LayersControl>
    </Map>
  );
}

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

export const PieChart: React.FC<{
  radius: number;
  counts: [string, number][];
  color: any;
  donut?: number;
}> = function({ radius, counts, color, donut = 0 }) {
  const arcs = useMemo(
    () =>
      d3
        .pie<[string, number]>()
        .sort(null)
        .value(d => d[1])(counts),
    [counts]
  );

  const arc = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(donut)
        .outerRadius(donut + radius),
    [radius, donut]
  );

  return (
    <g stroke="white">
      {_.map(arcs, a => (
        <path key={a.data[0]} fill={color(a.data[0])} d={arc(a as any)!}>
          <title>{a.data[0]}</title>
        </path>
      ))}
    </g>
  );
};
const scale = d3.scaleSqrt().range([5, 10]);

export const SipMarkers: React.FC<{
  $map: React.MutableRefObject<Map>;
}> = function({ $map }) {
  const color = useSelector(selectMainColor);

  const events = useSelector(selectLocalisedEvents);
  const createClusterIcon = useCallback(
    function(cluster: L.MarkerCluster) {
      const markers = cluster.getAllChildMarkers();
      const donut = 0;
      const radius = scale(markers.length);
      const size = (radius + donut) * 2;

      const counts = _(markers)
        .countBy('options.data-kind')
        .toPairs()
        .value();
      const svg = d3
        .create('svg')
        .attr('width', size)
        .attr('height', size)
        .attr('viewBox', [-donut - radius, -donut - radius, size, size] as any);
      const dom: HTMLElement = svg.node() as any;

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
    },
    [color]
  );

  const onClusterClick = useCallback(
    (e: any) => {
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
        $map.current.leafletElement.flyTo(cluster._cLatLng, zoomLevel);
      }
    },
    [$map]
  );

  return (
    <MarkerClusterGroup
      maxClusterRadius={50}
      zoomToBoundsOnClick={false}
      onclusterclick={onClusterClick}
      iconCreateFunction={createClusterIcon}
    >
      {_.map(events, event => {
        return <SipMarker key={event.id} event={event} />;
      })}
    </MarkerClusterGroup>
  );
};

export default SiprojurisMap;
const SipMarker: React.FC<{
  event: {
    localisation: NamedPlace;
    label: string;
    actor: string | number;
    id: string | number;
    kind: AnyEvent['kind'];
  };
}> = function({ event: { id, actor, kind, label, localisation } }) {
  const dispatch = useDispatch();

  const handleClick = useCallback(
    function() {
      dispatch(
        setSelection({
          id: id,
          kind: 'Event'
        })
      );
    },
    [id, dispatch]
  );

  const handleMouseOver = useCallback(
    function() {
      console.log('hover');
      dispatch(
        setHighlights({
          id: id,
          kind: 'Event'
        })
      );
    },
    [id, dispatch]
  );

  const handleMouseOut = useCallback(
    function(e) {
      console.log('out');
      dispatch(clearHighlights());
    },
    [dispatch]
  );

  return (
    <Marker
      data-id={id}
      data-kind={kind}
      data-actor={actor}
      onclick={handleClick}
      onmouseover={handleMouseOver}
      onmouseout={handleMouseOut}
      position={[+localisation.lat!, +localisation.lng!]}
    >
      <Popup>{label}</Popup>
    </Marker>
  );
};
