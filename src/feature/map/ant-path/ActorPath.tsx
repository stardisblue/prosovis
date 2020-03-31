import React, { useMemo, useCallback } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import _ from 'lodash';
import { AntPath, AntPathEvent } from './AntPath';
import useLazyRef from '../../../hooks/useLazyRef';
import { useSelector, useDispatch } from 'react-redux';
import { selectSwitchActorColor } from '../../../selectors/switch';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { setSelection } from '../../../reducers/selectionSlice';
export const ActorPath: React.FC<{
  id: string;
  $l: React.MutableRefObject<L.LayerGroup>;
  $hover: React.MutableRefObject<string | null>;
  chen: [AntPathEvent, AntPathEvent][];
  events: any[];
  offset: _.Dictionary<any>;
  total: {
    [x: string]: boolean;
  };
}> = function({ id, $l, chen, offset, total, $hover, events }) {
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
  const interactive = useMemo(
    () => _.map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHover = useHoverHighlight(interactive);
  const click = useCallback(() => dispatch(setSelection(interactive)), [
    dispatch,
    interactive
  ]);
  // event listeners
  useEffect(() => {
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
      // group persists across time and space
      // eslint-disable-next-line
      $group.current.off(handlers);
    };
  }, [id, $group, $hover, handleHover, click]);
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
