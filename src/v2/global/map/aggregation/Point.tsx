export const padding = 1;

export class Point<D = any> {
  protected _bbox?: {
    minX: number;
    minY: number;
    maxX: any;
    maxY: any;
  };
  id: string;
  x: number;
  y: number;
  private _clusters?: Point<D>[];
  private _size?: number;
  private _items?: D[];
  static cid: number = 0;
  data?: D;
  constructor(
    id: string,
    { x, y, items }: { x: number; y: number; items?: Point<D>[] },
    data?: D
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    if (data) this.data = data;
    if (items) this._clusters = items;
  }

  isCluster() {
    return this._clusters !== undefined;
  }

  overlaps(point: Point) {
    const other = point.getBBox();
    const self = this.getBBox();
    return (
      (other.minX < self.maxX || self.minX < other.maxX) &&
      (other.minY < self.maxY || self.minY < other.maxY)
    );
  }

  getBBox() {
    const pad = padding / 2;
    return (
      this._bbox ??
      (this._bbox = {
        minX: this.x - pad,
        minY: this.y - pad,
        maxX: this.x + pad,
        maxY: this.y + pad,
      })
    );
  }

  size(): number {
    return (
      this._size ??
      (this._size = !this._clusters
        ? 1
        : this._clusters.reduce((acc, i) => acc + i.size(), 0))
    );
  }

  items(): D[] {
    return (
      this._items ??
      (this._items = !this._clusters
        ? [this.data!]
        : this._clusters.flatMap((v) => v.items()))
    );
  }

  static merge<T extends Point>(points: T[]) {
    const id = 'c' + this.cid++;
    const props = this.mergeProperties(points);
    return new this(id, props) as T;
  }

  static mergeProperties<T extends Point>(items: T[]) {
    return {
      items,
      ...this.centerOfMass(items),
    };
  }

  static centerOfMass(points: Point[]) {
    const size = points.reduce((acc, p) => acc + p.size(), 0);
    return points.reduce(
      (options, p) => {
        options.x = options.x + (p.x * p.size()) / size;
        options.y = options.y + (p.y * p.size()) / size;
        return options;
      },
      { x: 0, y: 0 }
    );
  }
}
