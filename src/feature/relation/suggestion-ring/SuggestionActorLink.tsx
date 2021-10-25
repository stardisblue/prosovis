import React, { useEffect, useMemo } from 'react';
import { select } from 'd3';
import { map } from 'lodash';
import {
  chunk,
  flatMap,
  groupBy,
  keyBy,
  map as fpmap,
  meanBy,
  pipe,
  transform,
} from 'lodash/fp';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useDatum } from '../../../hooks/useD3';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { toCartesian } from '../../../utils';
import { ProsoVisSignedRelation } from '../../../v2/types/relations';
import {
  selectDisplayedActorRingLinks,
  selectIntersection,
  selectSortedGhosts,
} from './selectors';
import { disabled } from '../../../v2/components/theme';

export const selectClusteredSuggestionActorLinks = createSelector(
  selectDisplayedActorRingLinks,
  selectSortedGhosts,
  function (links, sorted) {
    const quarter = Math.floor(sorted.length / 4);
    const targets = map(sorted, 'target');

    const clusters: ProsoVisSignedRelation[][] = pipe(
      groupBy<ProsoVisSignedRelation>('source'),
      flatMap((byActor: ProsoVisSignedRelation[]) => {
        const ordered = keyBy('target', byActor);
        const clusters = pipe(
          fpmap((i: string) => ordered[i]),
          transform(
            (acc, v) => {
              if (v) {
                acc[acc.length - 1].push(v);
              } else {
                if (acc[acc.length - 1].length > 0) acc.push([]);
              }
            },
            [[]] as ProsoVisSignedRelation[][]
          )
        )(targets);

        if (clusters[clusters.length - 1].length === 0) {
          clusters.pop();
        }

        return flatMap(
          (v) =>
            v.length <= quarter + Math.ceil(quarter / 4)
              ? [v]
              : chunk(quarter, v),
          clusters
        );
      })
    )(Array.from(links.values()));

    return clusters;
  }
);

export const SuggestionActorLinks: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  x: (v: string) => number;
}> = function ({ $g, x }) {
  const clusters = useSelector(selectClusteredSuggestionActorLinks);

  return (
    <g ref={$g} stroke={disabled} strokeWidth={1.5} fill="none">
      {flatMap((cluster) => {
        const coordinates = cluster.map((datum) => ({
          theta: x(datum.target),
          length: 200,
        }));

        const toCart = (coordinate: { theta: number; length: number }) => {
          const { x: x1, y: y1 } = toCartesian(coordinate);
          return [x1, y1] as [number, number];
        };

        return cluster.map((re, i) => (
          <SuggestionActorLink
            key={re.id}
            datum={re}
            cluster={
              cluster.length > 1
                ? toCart({ theta: meanBy('theta', coordinates), length: 190 })
                : undefined
            }
            suggestion={toCart(coordinates[i])}
          />
        ));
      }, clusters)}
      {/* {Array.from(links, ([key, datum]) => (
        <SuggestionActorLink key={key} datum={datum} x={x} />
      ))} */}
    </g>
  );
};

export const SuggestionActorLink: React.FC<{
  datum: ProsoVisSignedRelation;
  suggestion: [number, number];
  cluster?: [number, number];
}> = function ({ datum, suggestion, cluster }) {
  // const nodes = useSelector(selectRelationNodes);

  // mutable values, cannot be memoized
  // const { x, y }: { x: number; y: number } = nodes.get(datum.source)! as any;
  const points: [number, number][] = useMemo(
    // () => (cluster ? [[x, y], cluster, suggestion] : [[x, y], suggestion]),
    // [x, y, cluster, suggestion]
    () => (cluster ? [cluster, suggestion] : [suggestion]),
    [cluster, suggestion]
  );

  // const kvDatum = useMemo(() => [datum, points.slice(1)], [datum, points]);
  const kvDatum = useMemo(() => [datum, points], [datum, points]);

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
      // d={path(points)!}
      style={{ mixBlendMode: 'multiply' }}
      stroke={color ? color(datum.source) : undefined}
      opacity={!active ? 1 : active.actor === datum.source ? 1 : 0.3}
      // fill="none"
      // stroke="#ccc"
    />
  );
};

export default SuggestionActorLink;
