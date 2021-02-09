import { padding, Point } from './Point';

export class Circle<T = any> extends Point<T> {
  radius: number;
  constructor(
    id: string,
    props: { x: number; y: number; items?: Point[] },
    data?: T
  ) {
    super(id, props, data);
    this.radius = Math.sqrt(this.size()) + 5;
  }

  overlaps(circle: Circle) {
    const minDist = this.radius + circle.radius + padding,
      x = Math.abs(this.x - circle.x),
      y = Math.abs(this.y - circle.y);
    return x * x + y * y < minDist * minDist;
  }

  getBBox() {
    const pad = padding / 2;

    return (
      this._bbox ??
      (this._bbox = {
        minX: this.x - this.radius - pad,
        minY: this.y - this.radius - pad,
        maxX: this.x + this.radius + pad,
        maxY: this.y + this.radius + pad,
      })
    );
  }

  // getMarker(latLng: [number, number]) {
  //   if (this._marker) return this._marker;
  //   const options: {radius: number,} = {
  //     radius: this.radius
  //   };
  //   if (this.items) {
  //     options.color = "royalblue";
  //   }
  //   if (debug.padding) {
  //     options.weight = this.constructor.padding;
  //     options.color = "red";
  //     options.fill = true;
  //     options.fillColor = '#3388ff';
  //   }

  //   return (this._marker = L.circleMarker(
  //     this.latLng || latLng,
  //     options
  //   ).bindTooltip(
  //     `items: ${this.size()}, radius:${Math.round(this.radius * 100) / 100}`,
  //     { direction: "top", offset: [0, -this.radius] }
  //   ));
  // }

  // getMarkers() {
  //   return (
  //     this._markers ||
  //     (this._markers = !this.items
  //       ? [this.getMarker()]
  //       : this.items.reduce((acc, i) => {
  //           acc.push(...i.getMarkers());
  //           return acc;
  //         }, []))
  //   );
  // }

  // toMarker(latLng) {
  //   if (!this.items) return this.getMarker();

  //   const markers = L.layerGroup(this.getMarkers());
  //   const icon = this.getMarker(latLng);
  //   const cluster = L.layerGroup([icon]);

  //   icon.on('mouseover', () => {
  //     cluster.addLayer(markers);
  //     icon.bringToFront();
  //   });
  //   icon.on('mouseout', () => {
  //     cluster.removeLayer(markers);
  //   });

  //   return cluster;
  // }
}
