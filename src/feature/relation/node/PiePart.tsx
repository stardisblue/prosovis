import React, { useMemo, useCallback } from 'react';
import _ from 'lodash';
import { LocEvents } from '../models';
import { useClickSelect, useFlatClick } from '../../../hooks/useClick';
import useHoverHighlight from '../../../hooks/useHoverHighlight';
import { useDispatch, useSelector } from 'react-redux';
import { setRelationSelection } from '../selectionSlice';
import {
  setRelationHighlight,
  clearRelationHighligh,
  selectRelationEmphasis,
} from '../highlightSlice';
export const PiePart: React.FC<{
  a: d3.PieArcDatum<LocEvents>;
  arc: d3.Arc<any, d3.PieArcDatum<LocEvents>>;
  parent: number;
}> = function ({ arc, a, parent }) {
  const dispatch = useDispatch();
  const emph = useSelector(selectRelationEmphasis);
  const [key, value] = a.data;

  const interactive = useMemo(
    () =>
      _.flatMap(
        Array.from(value.values(), (v) =>
          v.events.map((e) => ({ id: e, kind: 'Event' }))
        )
      ),
    [value]
  );

  // const { onClick, onMouseUp } = useClickSelect(interactive);
  const hover = useHoverHighlight(interactive);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      dispatch(setRelationSelection({ actor: parent, loc: key }));
      // onClick(event);
    },
    // [parent, key, dispatch, onClick]
    [parent, key, dispatch]
  );

  const handleMouseEnter = useCallback(() => {
    dispatch(setRelationHighlight({ actor: parent, loc: key }));
    hover.onMouseEnter();
  }, [parent, key, hover, dispatch]);

  const handleMouseLeave = useCallback(() => {
    dispatch(clearRelationHighligh());
    hover.onMouseLeave();
  }, [hover, dispatch]);

  const opacity =
    (emph && (emph.loc === key ? (emph.actor === parent ? 1 : 0.8) : 0.3)) ||
    undefined;

  return (
    <path
      d={arc(a)!}
      {...useFlatClick(handleClick)}
      // onClick={handleClick}
      // onMouseUp={onMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      opacity={opacity}
    >
      <title>{value.size}</title>
    </path>
  );
};

export default PiePart;
