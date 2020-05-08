import React from 'react';
import { toCartesian } from '../../../utils';
import useD3 from '../../../hooks/useD3';
import { selectRelationNodes } from '../selectRelations';
import { useSelector } from 'react-redux';
import { RelationEvent } from '../models';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { line } from 'd3-shape';
import { curveBundle } from 'd3-shape';
import _ from 'lodash';

export const SuggestionActorLinks: React.FC<{
  $g?: React.MutableRefObject<SVGGElement>;
  links: Map<string, RelationEvent>;
  nodes: RelationEvent[];
  x: d3.ScalePoint<number>;
}> = function ({ $g, links, nodes, x }) {
  const quarter = Math.floor(nodes.length / 4);
  const targets = _.map(nodes, 'target');

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
        v.length <= quarter + Math.ceil(quarter / 4) ? [v] : _.chunk(v, quarter)
      );
    })
    .value();

  return (
    <g ref={$g} stroke="#ccc" strokeWidth={1.5} fill="none">
      {_.flatMap(clusters, (cluster) => {
        const coordinates = _.map(cluster, (datum) => ({
          theta: x(datum.target)! + (x.bandwidth() + Math.PI) / 2,
          length: 200,
        }));

        const toCart = (coordinate: { theta: number; length: number }) => {
          const { x: x1, y: y1 } = toCartesian(coordinate);
          return [x1, y1] as [number, number];
        };

        const focalPoint =
          (cluster.length > 1 &&
            toCart({ theta: _.meanBy(coordinates, 'theta'), length: 190 })) ||
          undefined;

        return _.map(cluster, (re, i) => (
          <SuggestionActorLink
            key={re.id}
            datum={re}
            cluster={focalPoint}
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

const path = line().curve(curveBundle.beta(1));

export const SuggestionActorLink: React.FC<{
  datum: RelationEvent;
  suggestion: [number, number];
  cluster?: [number, number];
}> = function ({ datum, suggestion, cluster }) {
  const color = useSelector(selectSwitchActorColor);
  // const { locLinks } = useSelector(selectRelations);
  // const activeRelation = useSelector(selectRelationSelection);

  const nodes = useSelector(selectRelationNodes);

  // const { x: x1, y: y1 } = toCartesian({
  //   theta: x(datum.target)! + (x.bandwidth() + Math.PI) / 2,
  //   length: 200,
  // });

  const { x, y }: { x: number; y: number } = nodes.get(datum.source)! as any;

  const points: [number, number][] = cluster
    ? [[x, y], cluster, suggestion]
    : [[x, y], suggestion];

  const $path = useD3<SVGPathElement>([datum, points.slice(1)]);

  return (
    <path
      ref={$path}
      d={path(points)!}
      style={{ mixBlendMode: 'multiply' }}
      stroke={color ? color(datum.source) : undefined}
      // fill="none"
      // stroke="#ccc"
    />
  );
};

export default SuggestionActorLink;
