import { useDispatch } from 'react-redux';

import {
  SuperHightlightEvent,
  clearSuperHighlights,
  setSuperHighlights,
} from '../reducers/superHighlightSlice';

export default function useHoverHighlight(
  interactive: SuperHightlightEvent | SuperHightlightEvent[]
) {
  const dispatch = useDispatch();
  return {
    onMouseEnter: function () {
      return dispatch(setSuperHighlights(interactive));
    },
    onMouseLeave: function () {
      return dispatch(clearSuperHighlights());
    },
  };
}
