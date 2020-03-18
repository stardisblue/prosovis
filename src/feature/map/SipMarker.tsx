import React from 'react';
import { Marker } from './Marker';
import L from 'leaflet';
import { AnyEvent, NamedPlace, PrimaryKey } from '../../data';

import { useSelector } from 'react-redux';
import { selectMarkerColor } from '../../selectors/switch';
import { superSelectionAsMap } from '../../selectors/superHighlights';
import _ from 'lodash';

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
  // const dispatch = useDispatch();
  const { id, actor, kind, localisation } = event;
  const color = useSelector(selectMarkerColor);
  const selected = useSelector(superSelectionAsMap);
  // const handleClick = useCallback(
  //   function() {
  //     dispatch(
  //       setSelection({
  //         id: id,
  //         kind: 'Event'
  //       })
  //     );
  //   },
  //   [id, dispatch]
  // );

  // const handleMouseOver = useCallback(
  //   function() {
  //     console.log('hover');
  //     dispatch(
  //       setHighlights({
  //         id: id,
  //         kind: 'Event'
  //       })
  //     );
  //   },
  //   [id, dispatch]
  // );

  // const handleMouseOut = useCallback(
  //   function(e) {
  //     console.log('out');
  //     dispatch(clearHighlights());
  //   },
  //   [dispatch]
  // );

  return (
    <Marker
      $l={$l}
      //   data-id={id}
      //   data-kind={kind}
      //   data-actor={actor}
      //   onclick={handleClick}
      //   onmouseover={handleMouseOver}
      //   onmouseout={handleMouseOut}
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
