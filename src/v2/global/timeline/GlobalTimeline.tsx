import React, { useMemo, useRef } from 'react';
import { reduce, stack, stackOrderAscending } from 'd3';
import { useSelector } from 'react-redux';
import useDimensions from '../../../hooks/useDimensions';
import Loading from '../../components/Loading';
import { selectCustomFilterDefaultValues } from '../../selectors/mask/customFilter';
import { height } from './options';
import {
  flatten,
  selectBackgroundDiscrete,
  selectDiscrete,
  Tyvent,
} from './selectors';
import { StreamGraph } from './StreamGraph';

const GlobalTimeline: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const dimensions = useDimensions($svg);

  const events = useSelector(selectDiscrete);
  const backgroundEvents = useSelector(selectBackgroundDiscrete);
  const kinds = useSelector(selectCustomFilterDefaultValues);

  const stBackground = useMemo(
    () =>
      backgroundEvents &&
      stack<any, Tyvent<_.Dictionary<number>>, string>()
        .keys(kinds)
        // .offset(stackOffsetSilhouette)
        .order(stackOrderAscending)
        .value((d, k) => d.value[k] || 0)(flatten(backgroundEvents)),
    [backgroundEvents, kinds]
  );

  const st = useMemo(
    () =>
      events &&
      stBackground &&
      createActiveStack(stBackground, flatten(events)),
    [events, stBackground]
  );

  return (
    <Loading finished={st}>
      <svg height={height} width="100%" ref={$svg}>
        {dimensions?.width && (
          <>
            {/* <StreamGraph width={dimensions.width} stack={stBackground ?? []} />, */}
            <StreamGraph
              width={dimensions.width}
              stack={st ?? []}
              reference={stBackground ?? []}
            />
            ,
          </>
        )}
      </svg>
    </Loading>
  );
};

function createActiveStack(
  reference: d3.Series<Tyvent<_.Dictionary<number>>, string>[],
  filtered: Tyvent<_.Dictionary<number>>[]
) {
  return reduce(
    filtered,
    function (newStack, value: Tyvent<_.Dictionary<number>>, key) {
      return reduce(
        reference,
        function (newStack, ref, row) {
          if (!newStack[row]) {
            newStack[row] = [];
            newStack[row].key = ref.key;
            newStack[row].index = ref.index;
          }
          const [offset] = ref[key];
          const height = value.value[ref.key] ?? 0;
          newStack[row][key] = [offset, height + offset];
          newStack[row][key].data = value;

          return newStack;
        },
        newStack
      );
    },
    [] as { [k: string]: any }
  ) as d3.Series<Tyvent<_.Dictionary<number>>, string>[];
}

export default GlobalTimeline;
