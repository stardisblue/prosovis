import React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { LayersControl, TileLayer, Map } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import './SiprojurisMap.css';
import { setBoundsMask } from '../../reducers/maskSlice';
import SipMarkerClusterGroup from './SipMarkerClusterGroup';
import L from 'leaflet';

export const SiprojurisMap: React.FC<{ className?: string }> = function({
  className
}) {
  const dispatch = useDispatch();

  const $map = useRef<L.Map>(null as any);
  const handleRef = useCallback(function(dom: Map) {
    if (!dom) return;
    $map.current = dom.leafletElement;
    $map.current.fitWorld();
  }, []);

  const $markerLayer = useRef<any>();
  const handleMarkerLayerRef = useCallback(function(
    dom: LayersControl.Overlay
  ) {
    if (!dom) return;
    $markerLayer.current = dom;
  },
  []);

  useEffect(() => {
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
    <div className={className}>
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
          <LayersControl.Overlay
            name="Markers"
            checked
            ref={handleMarkerLayerRef}
          >
            <SipMarkerClusterGroup $layer={$markerLayer} $map={$map} />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="AntPaths" checked>
            <SipAnthPath />
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </div>
  );
};

const SipAnthPath: React.FC<{ $l?: any }> = function({ $l }) {
  useEffect(function() {
    // console.log($l.current.addLayer);
  });

  return null;
};

export default SiprojurisMap;
