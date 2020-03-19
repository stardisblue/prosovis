/// <reference types="react-scripts" />
/// <reference types="leaflet" />

declare module 'vis-timeline/standalone' {
  var x: any;
  export = x;
}

declare module 'leaflet-ant-path' {
  export function antPath(path: L.LatLng[] | [number, number][], options?: any);
}
