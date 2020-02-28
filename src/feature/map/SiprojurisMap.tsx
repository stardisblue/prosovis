import React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { LayersControl, TileLayer, Map } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import './SiprojurisMap.css';
import { setBoundsMask } from '../../reducers/maskSlice';
import SipMarkerClusterGroup from './SipMarkerClusterGroup';
import L from 'leaflet';

export const SiprojurisMap: React.FC = function() {
  const dispatch = useDispatch();

  const $map = useRef<L.Map>(null as any);

  const $markerLayer = useRef<any>();
  const handleRef = useCallback(function(dom: Map) {
    if (!dom) return;
    $map.current = dom.leafletElement;
  }, []);
  const handleMarkerLayerRef = useCallback(function(
    dom: LayersControl.Overlay
  ) {
    if (!dom) return;
    $markerLayer.current = dom.contextValue;
  },
  []);

  useEffect(() => {
    // if ($map.current === null) return;
    //console.log($map.current.leafletElement.getBounds());
    $map.current.invalidateSize();

    $map.current.on('moveend', function() {
      const bounds = $map.current.getBounds();
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
          <SipMarkerClusterGroup $l={$map} />
        </LayersControl.Overlay>

        <LayersControl.Overlay
          ref={handleMarkerLayerRef}
          name="AntPaths"
          checked
        >
          <SipAnthPath $l={$markerLayer} />
        </LayersControl.Overlay>
      </LayersControl>
    </Map>
  );
};

const SipAnthPath: React.FC<{ $l: any }> = function({ $l }) {
  useEffect(function() {
    console.log($l);
  });

  return null;
};

export default SiprojurisMap;
