import React, { useCallback, useMemo } from 'react';
import L from 'leaflet';
import { isEmpty } from 'lodash/fp';
import { useDispatch, useSelector } from 'react-redux';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { setSelection } from '../../../reducers/selectionSlice';
import { superSelectionAsMap } from '../../../selectors/superHighlights';
import { selectRichEventColor } from '../../../selectors/switch';
import { ProsoVisDetailRichEvent } from '../../../v2/types/events';
import { Marker } from './Marker';

const SipMarker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  $map: React.MutableRefObject<L.Map>;
  event: Required<ProsoVisDetailRichEvent>;
}> = function ({ $l, $map, event }) {
  const dispatch = useDispatch();
  const { place } = event;
  const { id } = event.event;
  const color = useSelector(selectRichEventColor);
  const selected = useSelector(superSelectionAsMap);
  const interactive = useMemo(() => ({ id, kind: 'Event' }), [id]);
  const { onMouseEnter, onMouseLeave } = useHoverHighlight(interactive);

  return (
    <Marker
      $map={$map}
      $l={$l}
      onClick={useCallback(
        () => dispatch(setSelection(interactive)),
        // safely ignoring dispatch
        // eslint-disable-next-line
        [interactive]
      )}
      onMouseOver={onMouseEnter}
      onMouseOut={onMouseLeave}
      latlng={[+place.lat!, +place.lng!]}
      options={{
        id,
        ...event,
        fillColor: color.main(event),
        color: color.border(event),
        fillOpacity: isEmpty(selected) || selected[id] !== undefined ? 1 : 0.5,
        weight: 1,
        radius: 5,
      }}
    >
      {/* <Popup>{label}</Popup> */}
    </Marker>
  );
};

export default SipMarker;
