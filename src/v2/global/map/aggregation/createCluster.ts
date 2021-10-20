import { hierarchy } from 'd3';
import fsac from '../../../libs/fsac/fsac';
import { RichEventLocalised } from '../../../selectors/mask';
import { Circle, circleBbox, circleOverlap } from './Circle';
import { RefCircleRbush } from './CircleRbush';

let id = 0;

export function Cluster(
  x: number,
  y: number,
  n: number,
  children: any,
  data?: RichEventLocalised
) {
  const obj: Circle = { id: id++, x, y, r: Math.sqrt(n) + 5, n, children };
  if (data) obj.data = data;
  return obj;
}

export function circleMerge(a: Circle, b: Circle) {
  const xs = a.x * a.n + b.x * b.n,
    ys = a.y * a.n + b.y * b.n,
    n = a.n + b.n;

  return Cluster(xs / n, ys / n, n, [a, b]);
}

export type RichEventCluster = Circle & { children: RichEventLocalised[] };

export const createClusters = (() => {
  const stopper = { stop: false, instance: 0 };

  return Object.assign(
    function (events: RichEventLocalised[], map: L.Map) {
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

      return hierarchy({ children: results } as Circle).children!.map((v) => {
        return {
          ...v.data,
          children: v.leaves().map((v) => v.data.data),
        } as RichEventCluster;
      });
    },
    {
      stop() {
        stopper.stop = true;
      },
    }
  );
})();
