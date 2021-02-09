import React, { useMemo } from 'react';

import { RichEventLocalised } from '../../selectors/mask';
import { useAggregation } from './aggregation/useAggregation';

import { FeatureGroup } from '../../components/leaflet/FeatureGroup';
import { useLeaflet } from '../../components/leaflet/context';
import { Marker } from '../../components/leaflet/Marker';
import { Circle } from './aggregation/Circle';
import { groupBy, pipe, sortBy, toPairs } from 'lodash/fp';
import PieChart from './PieChart';
import { useSelector } from 'react-redux';
import { selectSwitchKindColor } from '../../../selectors/switch';
import { darkgray } from '../../components/theme';

export const ClusterGroup: React.FC<{
  locs: RichEventLocalised[];
}> = function ({ locs }) {
  const { top } = useLeaflet();

  const clusters = useAggregation(locs, top);

  if (clusters) {
    return (
      <FeatureGroup>
        {clusters.map((v) => (
          <Cluster key={v.id} value={v} />
        ))}
      </FeatureGroup>
    );
  }
  return null;
};

export const Cluster: React.FC<{
  value: Circle<RichEventLocalised>;
}> = function ({ value }) {
  const { radius, x, y } = value;
  const { top } = useLeaflet();

  const parts = useMemo(
    () =>
      pipe(
        groupBy<RichEventLocalised[]>('event.kind'),
        toPairs,
        sortBy<[string, RichEventLocalised[]]>('0')
      )(value.items()),
    [value]
  );

  console.log(parts);

  return (
    <Marker latlng={top.layerPointToLatLng([x, y])} radius={radius}>
      <svg viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}>
        <PieChart radius={radius} counts={parts}>
          {(a, arc) => <PiePart key={a.data[0]} a={a} arc={arc} />}
        </PieChart>
      </svg>
    </Marker>
  );
};

export const PiePart: React.FC<{
  a: d3.PieArcDatum<[string, any[]]>;
  arc: d3.Arc<any, d3.PieArcDatum<[string, any[]]>>;
}> = function ({ a, arc }) {
  const color = useSelector(selectSwitchKindColor);

  const [id, values] = a.data;
  const d = arc(a)!;
  return (
    <g>
      <path opacity={0.3} d={d} fill={color ? color(id) : darkgray}>
        <title>{values.length}</title>
      </path>
      <path d={d} fill={color ? color(id) : darkgray}>
        <title>{values.length}</title>
      </path>
    </g>
  );
};
