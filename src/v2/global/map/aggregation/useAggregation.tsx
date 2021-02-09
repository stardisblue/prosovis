import { groupBy, map, pipe, sortBy, toPairs } from 'lodash/fp';
import RBush from 'rbush';
import { useEffect, useMemo, useState } from 'react';
import { RichEventLocalised } from '../../../selectors/mask';
import { Circle } from './Circle';

export class MyRBush extends RBush<Circle> {
  toBBox(item: Circle) {
    return item.getBBox();
  }
}

export function useAggregation(
  locs: RichEventLocalised[],
  map?: L.Map
): Circle[] | undefined {
  const [clusters, setClusters] = useState<Circle[]>();

  const createClusters = useMemo(() => {
    const tree = new MyRBush();
    const stopper = { stop: false, instance: 0 };

    return Object.assign(
      function (
        this: typeof stopper,
        results: { leafs: Circle[]; added?: Circle[] }
      ) {
        const instance = ++this.instance; // allows to detect multiple calls of zoomend

        do {
          tree.clear();
          tree.load(results.leafs);
          if (instance !== this.instance) return;
          results = aggregate(tree, tree.all());
          if (instance !== this.instance) return;
        } while (results.added!.length !== 0);
        setClusters(results.leafs);
      }.bind(stopper),
      {
        stop() {
          stopper.stop = true;
        },
      }
    );
  }, []);

  useEffect(() => {
    if (map) {
      const positionTree = new MyRBush(); // changed when zooming

      const current = { ping: true };
      current.ping = true;
      positionTree.clear();
      positionTree.load(
        locs.map(
          ({ event: { id }, place: { lat, lng } }) =>
            new Circle(id, map.latLngToLayerPoint([lat, lng]))
        )
      );
      const results = {
        leafs: positionTree.search(viewBounds(map)),
      };

      createClusters(results);

      return () => {
        createClusters.stop();
      };
    }
  }, [locs, createClusters, map]);

  return clusters;
}

function viewBounds(map: L.Map) {
  const bounds = map.getPixelBounds();
  const origin = map.getPixelOrigin();
  return {
    minX: bounds.min!.x - origin.x,
    minY: bounds.min!.y - origin.y,
    maxX: bounds.max!.x - origin.x,
    maxY: bounds.max!.y - origin.y,
  };
}

function aggregate(tree: MyRBush, leafs: Circle[]) {
  const dispose: _.Dictionary<Circle> = {};
  const added: Circle[] = [];
  const sorted = pipe(
    groupBy((l: Circle) => l.size()),
    toPairs,
    sortBy(([size]: [number, Circle[]]) => size * -1),
    map(([, shapes]) => sortBy('id', shapes))
  )(leafs);

  sorted.forEach(function (shapes) {
    shapes.forEach(function (shape) {
      if (dispose[shape.id]) return; // this node is marked for disposal
      const candidates = tree.search(shape.getBBox());

      if (candidates.length <= 1) return; // the only candidate is shape

      // candidates are not already marked for removal and is finegrain overlapping with shape
      let unmerged = candidates.filter(
        (s) => !dispose[s.id] && shape.overlaps(s)
      );
      if (unmerged.length <= 1) return; // only one unmerged in the results
      const cluster = Circle.merge(unmerged);
      unmerged.forEach((s) => (dispose[s.id] = cluster)); // mark them for removal
      added.push(cluster); // merge them
    });
  });

  return {
    // filter candidates marker for removal and add the new ones
    leafs: leafs.filter((s) => !dispose[s.id]).concat(added),
    added,
  };
}
