import React from 'react';
import { Marker } from './Marker';
import L from 'leaflet';
import { AnyEvent, NamedPlace, PrimaryKey } from '../../data';

const SipMarker: React.FC<{
  $l: React.MutableRefObject<L.LayerGroup>;
  event: {
    localisation: NamedPlace;
    label: string;
    actor: PrimaryKey;
    id: PrimaryKey;
    kind: AnyEvent['kind'];
  };
}> = function({ $l, event: { id, actor, kind, label, localisation } }) {
  // const dispatch = useDispatch();

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
      options={{ id, kind, actor }}
    >
      {/* <Popup>{label}</Popup> */}
    </Marker>
  );
};

export default SipMarker;
