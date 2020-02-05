import React, { useRef, useContext, useMemo, useCallback } from 'react';
import { Map, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';

import _ from 'lodash';

import './SiprojurisMap.css';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import { BirthEvent, getLocalisation } from '../../data';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LatLngBounds, latLng } from 'leaflet';

export function SiprojurisMap() {
  const {
    // events,
    // highlights,
    // setHighlights,
    // selected,
    // select,
    // setFilter,
    filteredEvents
  } = useContext(SiprojurisContext);

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

  const $map = useCallback(($map: Map) => {
    console.log($map.leafletElement.getBounds());

    $map.leafletElement.on('moveend', e => {
      const bounds = $map.leafletElement.getBounds();
      console.log(bounds);
      console.log(
        _.filter(localisationEvents, ({ localisation }) => {
          return localisation.lat && localisation.lng
            ? bounds.contains(latLng(localisation))
            : false;
        })
      );
    });
  }, []);

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
          <MarkerClusterGroup
            maxClusterRadius={50}
            zoomToBoundsOnClick={false}
            onclusterclick={(e: any) => {
              console.log(e.target);

              console.log(e.layer._group._spiderfied);
            }}
          >
            {_(localisationEvents)
              .map(event => {
                const localisation = event.localisation;
                if (localisation !== null) {
                  if (localisation.lat && localisation.lng) {
                    return (
                      <Marker
                        data-id={event.id}
                        onclick={function(e) {
                          console.log(e);
                        }}
                        onmouseover={function(e: any) {
                          console.log(e.target.options);
                        }}
                        onmouseout={function(e: any) {
                          console.log('out');
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
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="AntPaths" checked></LayersControl.Overlay> */}
      </LayersControl>
    </Map>
  );
}

export default SiprojurisMap;
