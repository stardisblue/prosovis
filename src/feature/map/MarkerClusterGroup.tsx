import React, {
  useEffect,
  useRef,
  useState,
  ReactPortal,
  useCallback
} from 'react';
import L, { FeatureGroup } from 'leaflet';
import 'leaflet.markercluster';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectMainColor, selectActorColor } from '../../selectors/color';
import * as d3 from 'd3';
import PieChart from './PieChart';
import ReactDOM from 'react-dom';
import { selectSwitch } from '../../reducers/switchSlice';
import { createSelector } from '@reduxjs/toolkit';

type Cluster = L.MarkerCluster & {
  _childClusters: Cluster[];
  _iconNeedsUpdate: boolean;
  _icon: HTMLElement;
  _leaflet_id: string;
  _svg: HTMLElement;
};

function getChildren(parent: Cluster) {
  return parent._childClusters;
}

function getChildClusters(parent: Cluster, aggregator: Cluster[]) {
  if (!parent._svg) parent._svg = d3.create('div').node()!;
  aggregator.push(parent);
  const childrens = getChildren(parent);

  if (childrens.length !== 0) {
    _.forEach(childrens, c => getChildClusters(c, aggregator));
  }

  return aggregator;
}

const scale = d3.scaleSqrt().range([5, 10]);

function iconCreateFunction(cluster: L.MarkerCluster) {
  const markers = cluster.getAllChildMarkers();
  const radius = scale(markers.length);
  const size = radius * 2;

  if (!(cluster as any)._svg) {
    (cluster as any)._svg = d3.create('div').node();
  }

  return L.divIcon({
    html: (cluster as any)._svg,
    className: '',
    iconSize: L.point(size, size)
  });
}

const selectColorSwitch = createSelector(
  selectSwitch,
  selectMainColor,
  selectActorColor,
  function(switcher, main, actor) {
    const countBy = switcher === 'Actor' ? 'options.actor' : 'options.kind';
    const color = switcher === 'Actor' ? actor : main;

    return { countBy, color };
  }
);

export const MarkerClusterGroup: React.FC<{
  $l: React.MutableRefObject<L.Map>;
  markers: (ref: React.MutableRefObject<L.MarkerClusterGroup>) => JSX.Element[];
  options?: L.MarkerClusterGroupOptions;
  onClusterClick?: L.LeafletMouseEventHandlerFn;
}> = function({ $l, markers, options, onClusterClick }) {
  const $group = useRef(
    L.markerClusterGroup({
      ...options,
      iconCreateFunction
    })
  );

  useEffect(
    function() {
      const p = $l.current;
      p.addLayer($group.current);
      return function() {
        p.removeLayer($group.current);
      };
    },
    // eslint-disable-next-line
    []
  );

  const grouper = useSelector(selectColorSwitch);

  const [portals, setPortals] = useState<ReactPortal[]>([]);
  useEffect(() => {
    console.log($group.current);
    const clusters = getChildClusters(
      ($group.current as any)._topClusterLevel as Cluster,
      []
    );

    setPortals(
      _.map(clusters, c => {
        const markers = c.getAllChildMarkers();
        const radius = scale(markers.length);
        const size = radius * 2;

        const counts = _(markers)
          .countBy(grouper.countBy)
          .toPairs()
          .value();

        return ReactDOM.createPortal(
          <svg
            width={size}
            height={size}
            viewBox={`${-radius} ${-radius} ${size} ${size}`}
          >
            <PieChart
              radius={radius}
              counts={counts}
              color={grouper.color}
              donut={0}
            />
          </svg>,
          c._svg
        );
      })
    );
  }, [markers, grouper]);

  useEffect(
    function() {
      if (!onClusterClick) return;
      const group = $group.current;
      group.on('clusterclick' as any, onClusterClick);
      return () => {
        group.off('clusterclick' as any, onClusterClick);
      };
    },
    [onClusterClick]
  );

  return (
    <>
      {markers($group)}
      {portals}
    </>
  );
};
