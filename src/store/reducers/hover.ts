import { createReducer } from 'typesafe-actions';
import { end, begin } from '../actions/hover';
export type HoverState = string | undefined;

export default createReducer(undefined)
  .handleAction(begin, (state, action) => {
    const id = action.payload;

    if (!state || state !== id) {
      return id;
    }

    return state;
  })
  .handleAction(end, () => undefined);
