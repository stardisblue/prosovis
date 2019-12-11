import React, { useRef } from 'react';
import {
  Map,
  TileLayer,
  LayersControl,
  LayerGroup,
  Marker,
  Popup
} from 'react-leaflet';
import { connect } from 'react-redux';

import './SiprojurisMap.css';

export function SiprojurisMap() {
  const $map = useRef(null);
  return (
    <Map
      bounds={[
        [48.853333, 2.348611],
        [46.5691, 0.348203]
      ]}
      ref={$map}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Markers" checked>
          <LayerGroup>
            <Marker position={[10, 10]}>
              <Popup>bonjour</Popup>
            </Marker>
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </Map>
  );
}

export default connect()(SiprojurisMap);
