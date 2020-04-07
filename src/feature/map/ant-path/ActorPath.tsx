import React, { useMemo, useCallback, useContext } from 'react';
import L from 'leaflet';
import { useEffect } from 'react';
import _ from 'lodash';
import { AntPath, AntPathEvent } from './AntPath';
import useLazyRef from '../../../hooks/useLazyRef';
import { useSelector, useDispatch } from 'react-redux';
import { selectSwitchActorColor } from '../../../selectors/switch';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { setSelection } from '../../../reducers/selectionSlice';
import { HoverContext } from '../HoverContext';

export const ActorPath: React.FC<{
  id: string;
  $l: React.MutableRefObject<L.LayerGroup>;
  // $hover: React.MutableRefObject<string | null>;
  chain: {
    segment: [AntPathEvent, AntPathEvent];
    diff: number;
    dist: number;
  }[];
  events: any[];
  offset: _.Dictionary<any>;
  total: {
    [x: string]: boolean;
  };
}> = function ({ id, $l, chain, offset, total, events }) {
  const $hover = useContext(HoverContext);
  const dispatch = useDispatch();

  const $group = useLazyRef<L.FeatureGroup<any>>(() => L.featureGroup());
  useEffect(function () {
    $l.current.addLayer($group.current);
    return function () {
      // layer persists across time and space
      // eslint-disable-next-line
      $l.current.removeLayer($group.current);
    };
    // safely disabling $layer ref
    // eslint-disable-next-line
  }, []);

  const colorFn = useSelector(selectSwitchActorColor);

  const interactive = useMemo(
    () => _.map(events, ({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHover = useHoverHighlight(interactive);
  const click = useCallback(() => dispatch(setSelection(interactive)), [
    dispatch,
    interactive,
  ]);
  // event listeners
  useEffect(() => {
    const debounceMouseOut = _.debounce(function () {
      if ($hover.current.id === id) {
        $hover.current.id = null;
        handleHover.onMouseLeave();
      }
    }, 100);

    const handlers: L.LeafletEventHandlerFnMap = {
      mouseover: function () {
        if ($hover.current.id !== id) {
          handleHover.onMouseEnter();
          $hover.current.id = id;
          $hover.current.cancel = debounceMouseOut.cancel;
        } else if ($hover.current.id === id) {
          $hover.current.cancel();
        }
      },
      mouseout: debounceMouseOut,
      click,
    };
    $group.current.on(handlers);
    return () => {
      // group persists across time and space
      // eslint-disable-next-line
      $group.current.off(handlers);
    };
  }, [id, $group, $hover, handleHover, click]);

  return (
    <>
      {_.map(chain, ({ segment, diff, dist }) => {
        const key = _.map(segment, 'event.id').join(':');
        const grp = _.map(segment, 'groupId').join(':');
        diff = diff < 0.5 ? 0.5 : diff;
        const dashes = dist / diff;
        return (
          <AntPath
            key={key}
            id={key}
            $l={$group}
            events={segment}
            offset={offset[key]}
            twoWay={total[grp]}
            dashArray={[2, dashes - 2]}
            delay={500}
            color={colorFn ? colorFn(id) : '#6c757d'}
          />
        );
      })}
    </>
  );
};
