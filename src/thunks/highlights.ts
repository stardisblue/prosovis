import { setHighlights, clearHighlights } from '../reducers/highlightSlice';
import {
  setSuperHightlights,
  clearSuperHighlights
} from '../reducers/superHighlightSlice';
import { PrimaryKey } from '../data';

type Highlight = {
  id: PrimaryKey;
  kind: string;
  type?: string;
};

export const setSuperHighlightThunk = function(
  payload: Highlight | Highlight[]
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
