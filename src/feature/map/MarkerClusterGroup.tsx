import React, { useEffect, useState, ReactPortal, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectMainColor, selectActorColor } from '../../selectors/color';
import * as d3 from 'd3';
import PieChart from './PieChart';
import ReactDOM from 'react-dom';
import { selectSwitch } from '../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import { superSelectionAsMap } from '../../selectors/superHighlights';

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
    // (cluster as any)._svg_is_child = (cluster as any)._svg_is_child;
  }

  return L.divIcon({
    html: (cluster as any)._svg,
    className: '',
    iconSize: L.point(size, size)
  });
}

const selectGrouper = createSelector(
  selectSwitch,
  selectMainColor,
  selectActorColor,
  superSelectionAsMap,
  function(switcher, main, actor, selected) {
    const groupBy =
      switcher === 'Actor'
        ? ({ options }: any) => options.actor
        : ({ options }: any) => options.kind;

    const selectionFilter = ({ options: { id } }: any) =>
      selected[id] !== undefined;

    const color = switcher === 'Actor' ? actor : main;

    const domain = color.domain();
    const range = _.map(domain, (d: any) => color(d));
    const sColor = d3
      .scaleOrdinal<string | number, string>()
      .domain(
        _.concat(
          _.map(domain, i => 's:' + i),
          domain
        )
      )
      .range(
        _.concat(
          range,
          _.map(range, d => {
            const cl = d3.color(d)!;
            cl.opacity = 0.7;
            return cl.toString();
          })
        )
      );

    return {
      groupBy,
      color: _.isEmpty(selected) ? color : sColor,
      selectionFilter
    };
  }
);

export const MarkerClusterGroup: React.FC<{
  $l: React.MutableRefObject<any>;
  markers: (ref: React.MutableRefObject<L.MarkerClusterGroup>) => JSX.Element[];
  options?: L.MarkerClusterGroupOptions;
  onClusterClick?: L.LeafletMouseEventHandlerFn;
}> = function({ $l, markers, options, onClusterClick }) {
  const $group = useRef<L.MarkerClusterGroup>(undefined as any);
  if ($group.current === undefined) {
    $group.current = L.markerClusterGroup({
      ...options,
      iconCreateFunction
    });
  }

  useEffect(
    function() {
      const p = $l.current;
      p.addLayer($group.current);
      return function() {
        // eslint-disable-next-line
        p.removeLayer($group.current);
      };
    },
    // eslint-disable-next-line
    []
  );

  const grouper = useSelector(selectGrouper);

  const [portals, setPortals] = useState<(ReactPortal | null)[]>([]);
  useEffect(() => {
    const clusters = getChildClusters(
      ($group.current as any)._topClusterLevel as Cluster,
      []
    );

    setPortals(
      _.map(clusters, c => {
        const markers = c.getAllChildMarkers();
        const radius = scale(markers.length);
        const size = radius * 2;

        const selected = _(markers)
          .filter(grouper.selectionFilter)
          .uniqBy(grouper.groupBy)
          .map(grouper.groupBy)
          .keyBy()
          .value();

        const groups = _(markers).groupBy(value => {
          const key = grouper.groupBy(value);
          if (selected[key]) {
            return 's:' + key;
          } else {
            return key;
          }
        });

        const counts = groups
          .toPairs()
          .sortBy(([key]) => (key.startsWith('s:') ? key.slice(2) : key))
          .value();

        // if (!c._svg_is_child) {
        return ReactDOM.createPortal(
          <svg
            width={size + 10}
            height={size + 10}
            viewBox={`${-radius - 5} ${-radius - 5} ${size + 10} ${size + 10}`}
          >
            <PieChart
              radius={radius}
              counts={counts}
              color={grouper.color}
              donut={5}
            />
          </svg>,
          c._svg
        );
        // }

        // return null;
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
