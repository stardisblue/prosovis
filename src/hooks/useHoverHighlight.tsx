import { useDispatch } from 'react-redux';
import {
  setSuperHighlightThunk,
  clearSuperHighlightThunk
} from '../thunks/highlights';
import { SuperHightlightEvent } from '../reducers/superHighlightSlice';
import { useHover } from 'react-use-gesture';

export default function useHoverHighlight(
  interactive: SuperHightlightEvent | SuperHightlightEvent[]
) {
  const dispatch = useDispatch();
  return useHover(e => {
    if (e.hovering) {
      dispatch(setSuperHighlightThunk(interactive));
    } else {
      dispatch(clearSuperHighlightThunk());
    }
  })();
}
