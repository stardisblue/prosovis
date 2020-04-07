import { setHighlights, clearHighlights } from '../reducers/highlightSlice';
import {
  setSuperHighlights,
  clearSuperHighlights,
  SuperHightlightEvent,
} from '../reducers/superHighlightSlice';

export const setSuperHighlightThunk = function (
  payload: SuperHightlightEvent | SuperHightlightEvent[]
) {
  return (dispatch: any) => {
    dispatch(setHighlights(payload));
    dispatch(setSuperHighlights(payload));
  };
};

export const clearSuperHighlightThunk = function () {
  return (dispatch: any) => {
    dispatch(clearHighlights());
    dispatch(clearSuperHighlights());
  };
};
