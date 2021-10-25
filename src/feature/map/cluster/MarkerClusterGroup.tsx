import React, { useEffect, useState, ReactPortal, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import PieChart from '../PieChart';
import ReactDOM from 'react-dom';
import { selectSwitchIsActor } from '../../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import { groupBy, map, pipe, sortBy, toPairs } from 'lodash/fp';
import { DataMarkerOptions, DataMarkerType } from '../marker/Marker';

// TODO
export const selectMarkerGroupBy = createSelector(
  selectSwitchIsActor,
  (switcher) =>
    switcher
      ? ({ actor }: DataMarkerOptions) => actor
      : ({ kind }: DataMarkerOptions) => kind
);

type Cluster = L.MarkerCluster & {
  _childClusters: Cluster[];
  _iconNeedsUpdate: boolean;
  _icon: HTMLElement;
  _leaflet_id: string;
  _svg_is_child: any;
  _svg: HTMLElement;
};

function getChildren(parent: Cluster) {
  return parent._childClusters;
}

function getChildClusters(current: Cluster, aggregator: Cluster[]) {
  if (!current._svg) {
    current._svg = d3.create('div').node()!;
    // current._svg_is_child = false;
  }
  aggregator.push(current);
  const childrens = getChildren(current);

  if (childrens.length !== 0) {
    if (childrens.length === 1 && !childrens[0]._svg) {
      // childrens[0]._svg = current._svg;
      // childrens[0]._svg_is_child = true;
    }
    childrens.forEach((c) => getChildClusters(c, aggregator));
  }

  return aggregator;
}

const scale = d3.scaleSqrt().range([0, 5]);

function iconCreateFunction(cluster: L.MarkerCluster) {
  const markers = cluster.getAllChildMarkers();
  const radius = scale(markers.length);
  const size = radius * 2 + 10;

  if (!(cluster as any)._svg) {
    (cluster as any)._svg = d3.create('div').node();
    // (cluster as any)._svg_is_child = (cluster as any)._svg_is_child;
  }

  return L.divIcon({
    html: (cluster as any)._svg,
    className: '',
    iconSize: L.point(size, size),
  });
}

export const MarkerClusterGroup: React.FC<{
  $l: React.MutableRefObject<any>;
  markers: (ref: React.MutableRefObject<L.MarkerClusterGroup>) => JSX.Element[];
  options?: L.MarkerClusterGroupOptions;
}> = function ({ $l, markers, options }) {
  const $group = useRef<L.MarkerClusterGroup>(undefined as any);
  if ($group.current === undefined) {
    $group.current = L.markerClusterGroup({
      ...options,
      iconCreateFunction,
    });
  }

  useEffect(
    function () {
      const p = $l.current;
      p.addLayer($group.current);
      return function () {
        // eslint-disable-next-line
        p.removeLayer($group.current);
      };
    },
    // eslint-disable-next-line
    []
  );

  const markerGroupBy = useSelector(selectMarkerGroupBy);

  const [portals, setPortals] = useState<(ReactPortal | null)[]>([]);
  useEffect(() => {
    const clusters = getChildClusters(
      ($group.current as any)._topClusterLevel as Cluster,
      []
    );

    setPortals(
      clusters.map((c) => {
        const markers: DataMarkerType[] = c.getAllChildMarkers() as any[];
        const radius = scale(markers.length);
        const size = radius * 2;

        const counts = pipe(
          map('options'),
          groupBy<DataMarkerOptions>(markerGroupBy),
          toPairs,
          sortBy<[string, L.MarkerOptions[]]>('0')
        )(markers);

        // if (!c._svg_is_child) {
        return ReactDOM.createPortal(
          <svg
            width={size + 10}
            height={size + 10}
            viewBox={`${-radius - 5} ${-radius - 5} ${size + 10} ${size + 10}`}
          >
            <PieChart radius={radius} counts={counts} donut={5} />
          </svg>,
          c._svg
        );
        // }

        // return null;
      })
    );
  }, [markers, markerGroupBy]);

  // useEffect(
  //   function() {
  //     if (!onClusterClick) return;
  //     const group = $group.current;
  //     group.on('clusterclick' as any, onClusterClick);
  //     return () => {
  //       group.off('clusterclick' as any, onClusterClick);
  //     };
  //   },
  //   [onClusterClick]
  // );

  return (
    <>
      {markers($group)}
      {portals}
    </>
  );
};
