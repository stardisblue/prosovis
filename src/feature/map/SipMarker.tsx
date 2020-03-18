import React, { useCallback } from 'react';
import { Marker } from './Marker';
import L from 'leaflet';
import { AnyEvent, NamedPlace, PrimaryKey } from '../../data';

import { useSelector, useDispatch } from 'react-redux';
import { selectMarkerColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import _ from 'lodash';
import { setSelection } from '../../reducers/selectionSlice';
import { setHighlights, clearHighlights } from '../../reducers/highlightSlice';
import {
  setSuperHighlightThunk,
  clearSuperHighlightThunk
} from '../../thunks/highlights';

const SipMarker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  event: {
    localisation: NamedPlace;
    label: string;
    actor: PrimaryKey;
    id: PrimaryKey;
    kind: AnyEvent['kind'];
  };
}> = function({ $l, event }) {
  const dispatch = useDispatch();
  const { id, actor, kind, localisation } = event;
  const color = useSelector(selectMarkerColor);
  const selected = useSelector(superSelectionAsMap);
  const handleClick = useCallback(
    function() {
      dispatch(
        setSelection({
          id: id,
          kind: 'Event'
        })
      );
    },
    // safely ignoring dispatch
    // eslint-disable-next-line
    [id]
  );

  const handleMouseOver = useCallback(
    function() {
      console.log('hover');
      dispatch(
        setSuperHighlightThunk({
          id: id,
          kind: 'Event'
        })
      );
    },
    // safely ignoring dispatch
    // eslint-disable-next-line
    [id]
  );

  const handleMouseOut = useCallback(
    function() {
      console.log('out');
      dispatch(clearSuperHighlightThunk());
    },
    // safely ignoring dispatch
    // eslint-disable-next-line
    []
  );

  return (
    <Marker
      $l={$l}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      latlng={[+localisation.lat!, +localisation.lng!]}
      options={{
        id,
        kind,
        actor,
        fillColor: color.main(event),
        color: color.border(event),
        fillOpacity:
          _.isEmpty(selected) || selected[id] !== undefined ? 1 : 0.5,
        weight: 1,
        radius: 5
      }}
    >
      {/* <Popup>{label}</Popup> */}
    </Marker>
  );
};

export default SipMarker;
