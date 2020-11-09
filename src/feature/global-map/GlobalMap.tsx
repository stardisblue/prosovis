import React from 'react';
import Map from '../../components/leaflet/Map';
import {
  Control,
  ControlBaseLayer as BaseLayer,
  ControlOverlay as Overlay,
} from '../../components/leaflet/Control';

import { TileLayer } from '../../components/leaflet/TileLayer';
import { LayerGroup } from '../../components/leaflet/LayerGroup';
import { Marker } from '../../components/leaflet/Marker';
import { selectMappableLocalisations } from '../../v2/selectors/localisations';
import { useSelector } from 'react-redux';
import { map } from 'lodash/fp';

const GlobalMap: React.FC = function () {
  const locs = useSelector(selectMappableLocalisations);
  console.log(locs);

  const markers = map(
    ({ value: { id }, localisation: { lat, lng } }) => (
      <Marker key={id} latlng={[lat, lng]} />
    ),
    locs
  );

  return (
    <Map
      bounds={[
        [48.853333, 2.348611],
        [46.5691, 0.348203],
      ]}
      options={{
        maxZoom: 15,
      }}
    >
      <Control>
        <BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </BaseLayer>
        <BaseLayer name="Esri.WorldTopoMap">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
          />
        </BaseLayer>
        <BaseLayer name="CartoDB.Positron">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
        </BaseLayer>
        <BaseLayer name="CartoDB.Voyager" checked>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
        </BaseLayer>
        <Overlay name="markers">
          <LayerGroup>{markers}</LayerGroup>
        </Overlay>
      </Control>
    </Map>
  );
};

export default GlobalMap;
