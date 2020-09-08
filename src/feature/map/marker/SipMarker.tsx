import React, { useCallback, useMemo } from 'react';
import { Marker } from './Marker';
import L from 'leaflet';
import {
  AnyEvent,
  NamedPlace,
  PrimaryKey,
  Datation,
  Actor,
} from '../../../data/models';

import { useSelector, useDispatch } from 'react-redux';
import { selectMarkerColor } from '../../../selectors/switch';
import { superSelectionAsMap } from '../../../selectors/superHighlights';
import _ from 'lodash';
import { setSelection } from '../../../reducers/selectionSlice';
import useHoverHighlight from '../../../hooks/useHoverHighlight';

const SipMarker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  $map: React.MutableRefObject<L.Map>;
  event: {
    localisation: NamedPlace;
    label: string;
    actor: Actor['id'];
    id: PrimaryKey;
    kind: AnyEvent['kind'];
    datation: Datation[];
  };
}> = function ({ $l, $map, event }) {
  const dispatch = useDispatch();
  const { id, actor, kind, localisation, datation } = event;
  const color = useSelector(selectMarkerColor);
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
      latlng={[+localisation.lat!, +localisation.lng!]}
      options={{
        id,
        kind,
        actor,
        dates: datation,
        fillColor: color.main(event),
        color: color.border(event),
        fillOpacity:
          _.isEmpty(selected) || selected[id] !== undefined ? 1 : 0.5,
        weight: 1,
        radius: 5,
      }}
    >
      {/* <Popup>{label}</Popup> */}
    </Marker>
  );
};

export default SipMarker;
