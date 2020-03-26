import { setHighlights, clearHighlights } from '../reducers/highlightSlice';
import {
  setSuperHightlights,
  clearSuperHighlights,
  SuperHightlightEvent
} from '../reducers/superHighlightSlice';

export const setSuperHighlightThunk = function(
  payload: SuperHightlightEvent | SuperHightlightEvent[]
) {
  return (dispatch: any) => {
    dispatch(setHighlights(payload));
    dispatch(setSuperHightlights(payload));
  };
};

export const clearSuperHighlightThunk = function() {
  return (dispatch: any) => {
    dispatch(clearHighlights());
    dispatch(clearSuperHighlights());
  };
};
