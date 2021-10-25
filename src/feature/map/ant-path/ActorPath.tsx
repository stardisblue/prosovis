import * as d3 from 'd3-scale';
import L from 'leaflet';
import { debounce, map } from 'lodash/fp';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import useLazyRef from '../../../hooks/useLazyRef';
import { setSelection } from '../../../reducers/selectionSlice';
import { selectSwitchActorColor } from '../../../selectors/switch';
import { darkgray } from '../../../v2/components/theme';
import { HoverContext } from '../HoverContext';
import { AntPath, AntPathEvent } from './AntPath';

const scale = d3.scaleLog().domain([1, 10]).range([2, 50]);

export const ActorPath: React.FC<{
  id: string;
  $l: React.MutableRefObject<L.LayerGroup>;
  // $hover: React.MutableRefObject<string | null>;
  chain: {
    segment: [AntPathEvent, AntPathEvent];
    diff: number;
    // dist: number;
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
    () => events.map(({ id }) => ({ id, kind: 'Event' })),
    [events]
  );
  const handleHover = useHoverHighlight(interactive);
  const click = useCallback(
    () => dispatch(setSelection(interactive)),
    [dispatch, interactive]
  );
  // event listeners
  useEffect(() => {
    const debounceMouseOut = debounce(100, function () {
      if ($hover.current.id === id) {
        $hover.current.id = null;
        handleHover.onMouseLeave();
      }
    });

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
      {chain.map(({ segment, diff }) => {
        const key = map('event.id', segment).join(':');
        const grp = map('groupId', segment).join(':');

        return (
          <AntPath
            key={key}
            id={key}
            $l={$group}
            events={segment}
            offset={offset[key]}
            twoWay={total[grp]}
            dashArray={[2, scale(diff < 1 ? 1 : diff)]}
            delay={500}
            color={colorFn ? colorFn(id) : darkgray}
          />
        );
      })}
    </>
  );
};

// inverser les traits sur les déplacements
// lieu et temps pour le graphe
// baricentre des voisins
// créer le graphe de connexité
// charger en local le graphe de connexité
// - utiliser les infos du graphe de connexité pour aider l'autocompletion
// - permettre d'agrandir le graphe en fonction des voisins
// - lors de la selection d'un fantome (voisin a ajouter) : proposer une popup pour supprimer les acteurs si supérieurs à 5
