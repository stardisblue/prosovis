import React, { useEffect, useMemo, useState } from 'react';

import { RichEventLocalised } from '../../selectors/mask';
import { createClusters, RichEventCluster } from './aggregation/createCluster';

import { FeatureGroup } from '../../components/leaflet/FeatureGroup';
import { useLeaflet } from '../../components/leaflet/context';
import { Marker } from '../../components/leaflet/Marker';
import { groupBy, pipe, sortBy, toPairs } from 'lodash/fp';
import PieChart from './PieChart';
import { ClusterPiePart } from './ClusterPiePart';

export const ClusterGroup: React.FC<{ locs: RichEventLocalised[] }> =
  function ({ locs }) {
    const { top } = useLeaflet();

    const [clusters, setClusters] = useState<RichEventCluster[]>();

    useEffect(() => {
      const result = createClusters(locs, top);
      if (result) setClusters(result);

      return () => {
        createClusters.stop();
      };
    }, [locs, top]);

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

export const Cluster: React.FC<{ value: RichEventCluster }> = function ({
  value,
}) {
  const { r, x, y } = value;
  const { top } = useLeaflet();

  const parts = useMemo(
    () =>
      pipe(
        groupBy<RichEventCluster[]>('event.kind'),
        toPairs,
        sortBy<[string, RichEventCluster[]]>('0')
      )(value.children),
    [value]
  );

  return (
    <Marker latlng={top.layerPointToLatLng([x, y])} radius={r}>
      <svg viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}>
        <PieChart radius={r} counts={parts}>
          {(a, arc) => (
            <ClusterPiePart key={a.data[0]} a={a} arc={arc} radius={r} />
          )}
        </PieChart>
      </svg>
    </Marker>
  );
};
