import React from 'react';
import { Marker, MarkerProps } from '../../components/leaflet/Marker';
import { RichEventLocalised } from '../../selectors/mask';
import { useAggregation } from './aggregation/useAggregation';

import { FeatureGroup } from '../../components/leaflet/FeatureGroup';
import { useLeaflet } from '../../components/leaflet/context';

const StyledMarkers = (props: MarkerProps) => (
  <Marker {...props} fillOpacity={0} color="black" weight={1} />
);

export const ClusterGroup: React.FC<{
  locs: RichEventLocalised[];
}> = function ({ locs }) {
  const { top } = useLeaflet();

  const clusters = useAggregation(locs, top);

  if (top && clusters) {
    return (
      <FeatureGroup>
        {clusters.map((v) => (
          <StyledMarkers
            key={v.id}
            latlng={top.layerPointToLatLng([v.x, v.y])}
            radius={v.radius}
          />
        ))}
      </FeatureGroup>
    );
  }
  return null;
};
