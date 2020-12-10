import React, { useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import { stack, stackOrderAscending } from 'd3';
import useDimensions from '../../../hooks/useDimensions';
import { height } from './options';
import { selectDiscrete, Tyvent } from './selectors';
import { countBy, map, pipe, sortBy, values } from 'lodash/fp';
import { selectAllKinds } from '../../selectors/events';
import { selectSwitchKindColor } from '../../../selectors/switch';
import { StreamGraph } from './StreamGraph';

const flatten = pipe(
  map<Tyvent<Tyvent<string>[]>, Tyvent<_.Dictionary<number>>>(
    ({ time, value }) => ({
      time,
      value: countBy('value', value),
    })
  ),
  sortBy<Tyvent<_.Dictionary<number>>>('time')
);

const GlobalTimeline: React.FC = function () {
  const $svg = useRef<SVGSVGElement>(null as any);
  const dimensions = useDimensions($svg);

  const events = useSelector(selectDiscrete);
  const kinds = useSelector(selectAllKinds);
  const color = useSelector(selectSwitchKindColor);

  const st = useMemo(
    () =>
      stack<any, Tyvent<_.Dictionary<number>>, string>()
        .keys(values(kinds))
        // .offset(stackOffsetSilhouette)
        .order(stackOrderAscending)
        .value((d, k) => d.value[k] || 0)(flatten(events)),
    [events, kinds]
  );

  return (
    <Loading finished={st}>
      <svg height={height} width="100%" ref={$svg}>
        {dimensions?.width && (
          <StreamGraph width={dimensions.width} stack={st} color={color} />
        )}
      </svg>
    </Loading>
  );
};

export default GlobalTimeline;
