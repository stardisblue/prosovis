import React, { useMemo, useEffect } from 'react';
import { toCartesian } from '../../../utils';
import { useDatum } from '../../../hooks/useD3';
import { selectRelationNodes } from '../selectRelations';
import { useSelector } from 'react-redux';
import { RelationEvent } from '../models';
import { selectSwitchActorColor } from '../../../selectors/switch';
import _ from 'lodash';
import {
  selectIntersection,
  selectDisplayedActorRingLinks,
  selectSortedGhosts,
} from './selectors';
import { select } from 'd3';
import { createSelector } from 'reselect';
import path from './path';

export const selectClusteredSuggestionActorLinks = createSelector(
  selectDisplayedActorRingLinks,
  selectSortedGhosts,
  function (links, sorted) {
    const quarter = Math.floor(sorted.length / 4);
    const targets = _.map(sorted, 'target');

    const clusters = _(Array.from(links.values()))
      .groupBy('source')
      .flatMap((byActor) => {
        const ordered = _.keyBy(byActor, 'target');
        const clusters = _(targets)
          .map((i) => ordered[i])
          .transform(
            (acc, v) => {
              if (v) {
                acc[acc.length - 1].push(v);
              } else {
                if (acc[acc.length - 1].length > 0) acc.push([]);
              }
            },
            [[]] as RelationEvent[][]
          )
          .value();

        if (clusters[clusters.length - 1].length === 0) {
          clusters.pop();
        }

        return _.flatMap(clusters, (v) =>
          v.length <= quarter + Math.ceil(quarter / 4)
            ? [v]
            : _.chunk(v, quarter)
        );
      })
      .value();
    return clusters;
  }
);

export const SuggestionActorLinks: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  x: (v: number) => number;
}> = function ({ $g, x }) {
  const clusters = useSelector(selectClusteredSuggestionActorLinks);

  return (
    <g ref={$g} stroke="#ccc" strokeWidth={1.5} fill="none">
      {_.flatMap(clusters, (cluster) => {
        const coordinates = _.map(cluster, (datum) => ({
          theta: x(datum.target),
          length: 200,
        }));

        const toCart = (coordinate: { theta: number; length: number }) => {
          const { x: x1, y: y1 } = toCartesian(coordinate);
          return [x1, y1] as [number, number];
        };

        return _.map(cluster, (re, i) => (
          <SuggestionActorLink
            key={re.id}
            datum={re}
            cluster={
              cluster.length > 1
                ? toCart({ theta: _.meanBy(coordinates, 'theta'), length: 190 })
                : undefined
            }
            suggestion={toCart(coordinates[i])}
          />
        ));
      })}
      {/* {Array.from(links, ([key, datum]) => (
        <SuggestionActorLink key={key} datum={datum} x={x} />
      ))} */}
    </g>
  );
};

export const SuggestionActorLink: React.FC<{
  datum: RelationEvent;
  suggestion: [number, number];
  cluster?: [number, number];
}> = function ({ datum, suggestion, cluster }) {
  const nodes = useSelector(selectRelationNodes);

  // mutable values, cannot be memoized
  const { x, y }: { x: number; y: number } = nodes.get(datum.source)! as any;
  const points: [number, number][] = cluster
    ? [[x, y], cluster, suggestion]
    : [[x, y], suggestion];

  const kvDatum = useMemo(() => [datum, points.slice(1)], [datum, points]);

  const $path = useDatum<SVGPathElement>(kvDatum);

  // if link persists
  useEffect(() => {
    if (!$path.current) return;
    select($path.current).datum(kvDatum);
  }, [$path, kvDatum]);

  const color = useSelector(selectSwitchActorColor);

  const active = useSelector(selectIntersection);

  return (
    <path
      ref={$path}
      d={path(points)!}
      style={{ mixBlendMode: 'multiply' }}
      stroke={color ? color(datum.source) : undefined}
      opacity={!active ? 1 : active.actor === datum.source ? 1 : 0.3}
      // fill="none"
      // stroke="#ccc"
    />
  );
};

export default SuggestionActorLink;
