import { useDispatch } from 'react-redux';
import {
  setSuperHighlightThunk,
  clearSuperHighlightThunk
} from '../thunks/highlights';
import { SuperHightlightEvent } from '../reducers/superHighlightSlice';

export default function useHoverHighlight(
  interactive: SuperHightlightEvent | SuperHightlightEvent[]
) {
  const dispatch = useDispatch();
  return {
    onMouseEnter: () => dispatch(setSuperHighlightThunk(interactive)),
    onMouseLeave: () => dispatch(clearSuperHighlightThunk())
  };
}
