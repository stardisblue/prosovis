import { hierarchy } from 'd3';
import fsac from '../../../libs/fsac/fsac';
import { RichEventLocalised } from '../../../selectors/mask';
import { Circle, circleBbox, circleOverlap } from './Circle';
import { RefCircleRbush } from './CircleRbush';

let uid = 0;

type ClusterT = Circle & { depth: number };

export function Cluster(
  x: number,
  y: number,
  n: number,
  children: [ClusterT, ClusterT] | null,
  data?: RichEventLocalised
) {
  const id =
    ((children && children[0].id) || (data && data.event.id)) ?? '' + uid++;
  const depth = children
    ? Math.max(children[0].depth, children[1].depth) + 1
    : 0;

  const obj: ClusterT = {
    id,
    x,
    y,
    r: Math.sqrt(n) + 5,
    n,
    children,
    depth,
  };
  if (data) obj.data = data;
  return obj;
}

export function circleMerge(a: ClusterT, b: ClusterT) {
  const xs = a.x * a.n + b.x * b.n,
    ys = a.y * a.n + b.y * b.n,
    n = a.n + b.n;

  return Cluster(xs / n, ys / n, n, [a, b]);
}

export type RichEventCluster = Omit<Circle, 'children'> & {
  children: RichEventLocalised[];
};

export const createClusters = (() => {
  const stopper = { stop: false, instance: 0 };

  return Object.assign(
    function (events: RichEventLocalised[], map: L.Map) {
      if (events.length === 0) return [];
      const instance = ++stopper.instance; // allows to detect multiple calls of zoomend
      if (instance !== stopper.instance) return;
      const results = fsac(
        events.map((event) => {
          const { x, y } = map.latLngToLayerPoint(event.place);
          return Cluster(x, y, 1, null, event);
        }),
        {
          merge: circleMerge,
          overlap: circleOverlap,
          bbox: circleBbox,
          Rbush: RefCircleRbush,
        }
      );

      if (instance !== stopper.instance) return;

      return (
        hierarchy({ children: results } as any as ClusterT).children?.map(
          (v) => {
            const {
              data: { id, depth, ...d },
            } = v;
            return {
              ...d,
              id,
              children: v.leaves().map((v) => v.data.data),
            } as RichEventCluster;
          }
        ) || ([] as RichEventCluster[])
      );
    },
    {
      stop() {
        stopper.stop = true;
      },
    }
  );
})();
