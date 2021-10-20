import Rbush from 'rbush';

export type Circle<T = any> = {
  x: number;
  y: number;
  r: number;
  n: number;
  children: any;
  data?: T;
};

function circleBbox(circle: Circle) {
  return {
    minX: circle.x - circle.r,
    minY: circle.y - circle.r,
    maxX: circle.x + circle.r,
    maxY: circle.y + circle.r,
  };
}

export function circleMerge(a: Circle, b: Circle) {
  const xs = a.x * a.n + b.x * b.n,
    ys = a.y * a.n + b.y * b.n,
    n = a.n + b.n;

  return Cluster(xs / n, ys / n, n, [a, b]);
}

export function circleOverlap(a: Circle, b: Circle) {
  return (a.r + b.r) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function Cluster(
  x: number,
  y: number,
  n: number,
  children?: any,
  data?: any
) {
  const obj: Circle = { x, y, r: Math.sqrt(n), n, children };
  if (data) obj.data = data;
  return obj;
}

export class RefCircleRbush<T extends Circle = Circle> extends Rbush<Ref<T>> {
  toBBox(item: Ref<T>) {
    return circleBbox(item.v);
  }

  compareMinX(a: Ref<T>, b: Ref<T>) {
    return a.v.x - a.v.r - (b.v.x - b.v.r);
  }

  compareMinY(a: Ref<T>, b: Ref<T>) {
    return a.v.y - a.v.r - (b.v.y - b.v.r);
  }
}

type Ref<T> = { v: T };

const ref = <T>(v: T): Ref<T> => ({ v });

export type FSACOptions<T> = {
  merge: (a: T, b: T) => T;
  overlap: (a: T, b: T) => number;
  bbox: (item: T) => {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  Rbush: { new (): Rbush<Ref<T>> };
  brk?: boolean;
  reverse?: boolean;
  sort?: boolean;
};

export default function fsac<T = any>(clusters: T[], opts: FSACOptions<T>): T[];
export default function fsac<T extends Circle = Circle>(
  clusters: T[],
  opts?: Partial<FSACOptions<T>>
): T[];
export default function fsac(
  clusters: Circle[],
  {
    merge = circleMerge,
    overlap = circleOverlap,
    bbox = circleBbox,
    Rbush = RefCircleRbush,
    brk = false,
    reverse = false,
    sort = true,
  }: Partial<FSACOptions<Circle>> = {}
) {
  const refs = clusters.map(ref);
  const alives = new Set(refs);
  const collision = new Rbush();
  collision.load(refs);

  for (const refCl of alives) {
    let updated = false;
    let clustered = true;
    let cluster = refCl.v;

    while (clustered) {
      clustered = false;
      const candidates = collision.search(bbox(cluster));

      const indexes = new Uint32Array(candidates.length);
      {
        // unloads overlaps as soon as it's not used
        const overlaps = new Float64Array(candidates.length);
        for (let i = 0; i < candidates.length; i++) {
          indexes[i] = i;
          overlaps[i] = overlap(cluster, candidates[i].v);
        }
        if (sort) indexes.sort((a, b) => overlaps[b] - overlaps[a]);
      }

      const iterated = reverse ? indexes.reverse() : indexes;

      for (const i of iterated) {
        const refCandidate = candidates[i];
        if (refCl === refCandidate) continue;

        if (overlap(cluster, refCandidate.v) > 0) {
          if (!updated) updated = true;

          cluster = merge(cluster, refCandidate.v);
          alives.delete(refCandidate);
          collision.remove(refCandidate);
          if (!clustered) clustered = true;
          if (brk) break;
        }
      }
    }
    if (updated) {
      collision.remove(refCl);
      refCl.v = cluster;
      collision.insert(refCl);
    }
  }

  return Array.from(alives, ({ v }) => v);
}
