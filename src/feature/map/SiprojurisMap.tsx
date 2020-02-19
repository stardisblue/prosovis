import { latLng } from 'leaflet';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { LayersControl, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalisation } from '../../data';
import { clearHighlights, setHighlights } from '../../reducers/highlightSlice';
import { setSelection } from '../../reducers/selectionSlice';
import { selectMaskedEvents } from '../../selectors/mask';
import './SiprojurisMap.css';

export function SiprojurisMap() {
  const filteredEvents = useSelector(selectMaskedEvents);

  const localisationEvents: any[] = useMemo(
    () =>
      _(filteredEvents)
        .filter(e => getLocalisation(e) !== null)
        .map(e => ({
          localisation: getLocalisation(e),
          label: e.label,
          id: e.id
        }))
        .value(),
    [filteredEvents]
  );

  const $map = useRef<Map>(null);

  useEffect(() => {
    if ($map.current === null) return;
    console.log($map.current.leafletElement.getBounds());

    $map.current.leafletElement.on('moveend', e => {
      if ($map.current === null) return null;
      const bounds = $map.current.leafletElement.getBounds();
      console.log(bounds);
      console.log(
        _.filter(localisationEvents, ({ localisation }) => {
          return localisation.lat && localisation.lng
            ? bounds.contains(latLng(localisation))
            : false;
        })
      );
    });
  }, [localisationEvents]);

  return (
    <Map
      bounds={[
        [48.853333, 2.348611],
        [46.5691, 0.348203]
      ]}
      ref={$map}
      maxZoom={15}
      style={{ maxHeight: '600px' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Markers" checked>
          <SipMarkers mapRef={$map} events={localisationEvents} />
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="AntPaths" checked></LayersControl.Overlay> */}
      </LayersControl>
    </Map>
  );
}

export const SipMarkers: React.FC<{ mapRef: any; events: any[] }> = function({
  mapRef,
  events
}) {
  const dispatch = useDispatch();

  return (
    <MarkerClusterGroup
      maxClusterRadius={50}
      zoomToBoundsOnClick={false}
      onclusterclick={(e: any) => {
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
          mapRef.current!.leafletElement.flyTo(cluster._cLatLng, zoomLevel);
        }
        console.log(cluster, bottomCluster, zoomLevel);
      }}
    >
      {_(events)
        .map(event => {
          const localisation = event.localisation;
          if (localisation !== null) {
            if (localisation.lat && localisation.lng) {
              return (
                <Marker
                  data-id={event.id}
                  onclick={function(e) {
                    dispatch(
                      setSelection({
                        id: e.target.options['data-id'],
                        kind: 'Event'
                      })
                    );
                  }}
                  onmouseover={function(e: any) {
                    console.log(e.target.options);
                    dispatch(
                      setHighlights({
                        id: e.target.options['data-id'],
                        kind: 'Event'
                      })
                    );
                  }}
                  onmouseout={function(e: any) {
                    console.log('out');
                    dispatch(clearHighlights());
                  }}
                  key={event.id}
                  position={[+localisation.lat, +localisation.lng]}
                >
                  <Popup>{event.label}</Popup>
                </Marker>
              );
            } else {
              console.log(event.localisation);
            }
          }
          return null;
        })
        .compact()
        .value()}
    </MarkerClusterGroup>
  );
};

export default SiprojurisMap;
