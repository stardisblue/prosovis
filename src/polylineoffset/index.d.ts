type PolylineOffsetOptions = L.CircleMarkerOptions & {
  offset?: string | number;
};

export class PolylineOffset extends L.Polyline {
  new(
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: PolylineOffsetOptions
  ): PolylineOffset;

  options: PolylineOffsetOptions;
}

export default PolylineOffset;
