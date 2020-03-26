import React, { useCallback, useMemo } from 'react';
import { Marker } from './Marker';
import L from 'leaflet';
import { AnyEvent, NamedPlace, PrimaryKey } from '../../data';

import { useSelector, useDispatch } from 'react-redux';
import { selectMarkerColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import _ from 'lodash';
import { setSelection } from '../../reducers/selectionSlice';
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
  const interactive = useMemo(() => ({ id, kind: 'Event' }), [id]);

  return (
    <Marker
      $l={$l}
      onClick={useCallback(
        () => dispatch(setSelection(interactive)),
        // safely ignoring dispatch
        // eslint-disable-next-line
        [interactive]
      )}
      onMouseOver={useCallback(
        () => dispatch(setSuperHighlightThunk(interactive)),
        // safely ignoring dispatch
        // eslint-disable-next-line
        [interactive]
      )}
      onMouseOut={useCallback(
        () => dispatch(clearSuperHighlightThunk()),
        // safely ignoring dispatch
        // eslint-disable-next-line
        []
      )}
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
