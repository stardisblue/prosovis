import React, { useCallback, useState } from 'react';
import Map from '../../components/leaflet/Map';
import {
  Control,
  ControlBaseLayer as BaseLayer,
  ControlOverlay as Overlay,
} from '../../components/leaflet/Control';

import { TileLayer } from '../../components/leaflet/TileLayer';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash/fp';
import Loading from '../../components/Loading';
import {
  RichEventLocalised,
  selectRichEventLocalised,
} from '../../selectors/mask';
import { latLngBounds } from 'leaflet';
import { setMaskGlobalMapBounds } from '../../reducers/mask/globalMapBoundsSlice';
import { ClusterGroup } from './ClusterGroup';

//         fillColor: color.main(event),
// color: color.border(event),
// fillOpacity:
//   _.isEmpty(selected) || selected[id] !== undefined ? 1 : 0.5,
// weight: 1,
// radius: 5,

const GlobalMap: React.FC = function () {
  const locs = useSelector(selectRichEventLocalised);

  return (
    <Loading finished={locs} hide>
      <LoadedGlobalMap locs={locs!} />
    </Loading>
  );
};

const LoadedGlobalMap: React.FC<{
  locs: RichEventLocalised[];
}> = function ({ locs }) {
  const dispatch = useDispatch();

  const [bounds] = useState(() => latLngBounds(map((l) => l.place, locs)));

  const onMoveEnd = useCallback(
    function (e: L.LeafletEvent) {
      const bounds = (e.target as L.Map).getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      dispatch(
        setMaskGlobalMapBounds([
          { lat: sw.lat, lng: sw.lng },
          { lat: ne.lat, lng: ne.lng },
        ])
      );
    },
    [dispatch]
  );

  return (
    <Map
      defaultBounds={bounds}
      options={{
        maxZoom: 15,
      }}
      onMoveEnd={onMoveEnd}
    >
      <Control>
        <BaseLayers />
        <Overlay name="markers">
          <ClusterGroup locs={locs}></ClusterGroup>
        </Overlay>
      </Control>
    </Map>
  );
};

const BaseLayers: React.FC = function () {
  return (
    <>
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
    </>
  );
};
export default GlobalMap;
