import React, { useMemo } from 'react';

import { RichEventLocalised } from '../../selectors/mask';
import { useAggregation } from './aggregation/useAggregation';

import { FeatureGroup } from '../../components/leaflet/FeatureGroup';
import { useLeaflet } from '../../components/leaflet/context';
import { Marker } from '../../components/leaflet/Marker';
import { Circle } from './aggregation/Circle';
import { groupBy, pipe, sortBy, toPairs } from 'lodash/fp';
import PieChart from './PieChart';
import { ClusterPiePart } from './ClusterPiePart';

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

  return (
    <Marker latlng={top.layerPointToLatLng([x, y])} radius={radius}>
      <svg viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}>
        <PieChart radius={radius} counts={parts}>
          {(a, arc) => (
            <ClusterPiePart key={a.data[0]} a={a} arc={arc} radius={radius} />
          )}
        </PieChart>
      </svg>
    </Marker>
  );
};
