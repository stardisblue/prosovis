import React, {
  useMemo,
  useState,
  useReducer,
  useRef,
  useCallback
} from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import _ from 'lodash';
import { AntPath } from './AntPath';
import { PayloadAction } from '@reduxjs/toolkit';
import * as d3 from 'd3-array';
import useLazyRef from '../../../hooks/useLazyRef';
import { useSelector, useDispatch } from 'react-redux';
import { selectSwitchActorColor } from '../../../selectors/switch';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { setSelection } from '../../../reducers/selectionSlice';
import { superSelectionAsMap } from '../../../selectors/superHighlights';

const markerReducer = function(state: any, action: PayloadAction<any>) {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return { ...state, [action.payload.options.id]: action.payload };
    case 'remove':
      return _.pickBy(state, (_value, key) => {
        // weak equal to mitigate issues between number and string
        return key !== action.payload.options.id.toString();
      });
    default:
      throw new Error();
  }
};

const SipAnthPaths: React.FC<{
  $map: React.MutableRefObject<L.Map>;
  $l: React.MutableRefObject<any>;
  defaultMarkerSet: React.MutableRefObject<any[]>;
}> = function({ $map, $l, defaultMarkerSet }) {
  const $group = useLazyRef<L.LayerGroup<any>>(() => L.layerGroup());
  const $hover = useRef<any>(null);

  useEffect(function() {
    $l.current.addLayer($group.current);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer($group.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const [markers, dispatch] = useReducer(markerReducer, {});
  const [zoom, setZoom] = useState(() => $map.current.getZoom());

  useEffect(() => {
    const map = $map.current;

    dispatch({
      type: 'set',
      payload: _(defaultMarkerSet.current)
        .keyBy('options.id')
        .value()
    });

    const handleZoom = () => setZoom(map.getZoom());

    const handleMarkerAdd = (e: any) =>
      dispatch({ type: 'add', payload: e.current });

    const handleMarkerRemove = (e: any) =>
      dispatch({ type: 'remove', payload: e.current });

    map.on({
      zoomend: handleZoom,
      'sip-marker': handleMarkerAdd,
      'sip-marker-off': handleMarkerRemove
    } as any);

    return () => {
      map.off({
        zoomend: handleZoom,
        'sip-marker': handleMarkerAdd,
        'sip-marker-off': handleMarkerRemove
      } as any);
    };
    // safely disabling $map and initialMarkerSet
    // eslint-disable-next-line
  }, []);

  const chens = useMemo(
    () =>
      _(markers)
        .map(marker => ({
          // extracting current cluster or marker position and id
          event: marker.options,
          ...getMarkerLatLng(marker, zoom)
        }))
        .groupBy('event.actor') // grouping by actors
        .mapValues((
          events // chaining values
        ) =>
          // 1. get first element in a cluster
          ({
            events: _.map(events, 'event'),
            chen: _(events)
              .sortBy(({ event }) => _.first<any>(event.dates).clean_date)
              .sortedUniqBy('groupId')
              .thru<
                [
                  { groupId: any; latLng: any; event: any },
                  { groupId: any; latLng: any; event: any }
                ][]
              >(d3.pairs) //, ([, last], [first]) => [last, first]))
              .value()
          })
        )
        // 5. we obtain a chain for each actor
        .value(),
    [zoom, markers]
  );

  const reference = useMemo(
    function() {
      const flatChens = _(chens)
        .flatMap(({ chen }) => chen)
        .sortBy(([, { event }]) => _.first<any>(event.dates).clean_date)
        .value();

      const total = _(flatChens)
        .map(v => _.map(v, 'groupId'))
        .keyBy(v => v.join(':'))
        .mapValues(
          (ids, _key, reference) =>
            reference[[...ids].reverse().join(':')] !== undefined
        )
        .value();

      const offset = _(flatChens)
        .groupBy(v =>
          _(v)
            .map('groupId')
            .join(':')
        )
        .mapValues(chen =>
          _(chen)
            .map((segment, i) => [_.map(segment, 'event.id').join(':'), i])
            .value()
        )
        .flatMap(v => v)
        .fromPairs()
        .value();

      return { offset, total };
    },
    [chens]
  );

  return (
    <>
      {/* {_.map(groups, (events, key) => (
        <AntPath key={key} id={key} $l={$group} events={events} />
      ))} */}
      {_.map(chens, ({ chen, events }, key) => (
        <ActorPath
          key={key}
          id={key}
          $l={$group}
          $hover={$hover}
          chen={chen}
          events={events}
          {...reference}
        />
      ))}
    </>
  );
};

export const ActorPath: React.FC<any> = function({
  id,
  $l,
  chen,
  offset,
  total,
  $hover,
  events
}) {
  const dispatch = useDispatch();
  const $group = useLazyRef<L.FeatureGroup<any>>(() => L.featureGroup());

  useEffect(function() {
    $l.current.addLayer($group.current);
    return function() {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer($group.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const selected = useSelector(superSelectionAsMap);
  const interactive = useMemo(
    () => _.map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );

  const handleHover = useHoverHighlight(interactive);
  const click = useCallback(() => dispatch(setSelection(interactive)), [
    dispatch,
    interactive
  ]);
  useEffect(
    function() {
      const debounceMouseOut = _.debounce(function(e) {
        if ($hover.current === id) {
          $hover.current = null;
          handleHover.onMouseLeave();
        }
      }, 100);

      const handlers: L.LeafletEventHandlerFnMap = {
        mouseover: () => {
          if ($hover.current !== id) {
            handleHover.onMouseEnter();
            $hover.current = id;
          } else if ($hover.current === id) debounceMouseOut.cancel();
        },
        mouseout: debounceMouseOut,
        click
      };

      $group.current.on(handlers);

      return () => {
        $group.current.off(handlers);
      };
    },
    [id, $group, $hover, handleHover]
  );

  const colorFn = useSelector(selectSwitchActorColor);
  const color = colorFn ? colorFn(id) : '#6c757d';

  return (
    <>
      {_.map(chen, segment => {
        const key = _.map(segment, 'event.id').join(':');
        const grp = _.map(segment, 'groupId').join(':');
        return (
          <AntPath
            key={key}
            id={key}
            $l={$group}
            events={segment}
            offset={offset[key]}
            twoWay={total[grp]}
            color={color}
          />
        );
      })}
    </>
  );
};

// alpha lors de la selection
// ou survol,
// survol/ selection d'un acteur sur information
// survol acteur dans timeline

export default SipAnthPaths;

function getMarkerLatLng(marker: any, zoom: number) {
  let cluster = marker.__parent;
  if (!cluster || cluster._zoom < zoom) {
    return { groupId: marker._leaflet_id, latLng: marker.getLatLng() };
  }
  while (cluster._zoom === undefined || cluster._zoom > zoom) {
    cluster = cluster.__parent;
  }
  return { groupId: cluster._leaflet_id, latLng: cluster.getLatLng() };
}
// ! UNUSED
// _(clusterRef.current.getLayers())
//   .map(marker => {
//     let cluster = marker.__parent;
//     while (cluster._zoom === undefined || cluster._zoom > zoom) {
//       cluster = cluster.__parent;
//     }
//     return {
//       marker,
//       groupId: cluster._leaflet_id,
//       latLng: cluster.getLatLng()
//     };
//   })
//   .groupBy('groupId')
//   .mapValues(markers => ({
//     markers: _(markers)
//       .map('marker.options.id')
//       .value(),
//     id: markers[0].groupId,
//     latLng: markers[0].latLng
//   }))
//   .value()

//! UNUSED
// 3. zip them together :)
// .zip(
//   // 2. get last element in a cluster
//   _(events)
//     .orderBy(
//       ({ event }) => _.last<any>(event.dates).clean_date,
//       'desc'
//     )
//     .sortedUniqBy('groupId')
//     .reverse()
//     .value()
// )
// 4. chain them together \o/
