import React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { LayersControl, TileLayer, Map } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import './SiprojurisMap.css';
import { setBoundsMask } from '../../reducers/maskSlice';
import SipMarkerClusterGroup from './SipMarkerClusterGroup';
import L from 'leaflet';
import SipAnthPaths from './SipAnthPaths';

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

  const $antPathLayer = useRef<any>();
  const handleAntPathLayerRef = useCallback(function(
    dom: LayersControl.Overlay
  ) {
    if (!dom) return;
    $antPathLayer.current = dom;
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

  /**
   * 
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: ''
});
   * 
   */
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
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri.WorldTopoMap">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="CartoDB.Positron">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="CartoDB.Voyager">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay
            name="Markers"
            checked
            ref={handleMarkerLayerRef}
          >
            <SipMarkerClusterGroup $layer={$markerLayer} $map={$map} />
          </LayersControl.Overlay>
          <LayersControl.Overlay
            ref={handleAntPathLayerRef}
            name="AntPaths"
            checked
          >
            <SipAnthPaths $layer={$antPathLayer} $map={$map} />
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </div>
  );
};

export default SiprojurisMap;
