import { createReducer } from 'typesafe-actions';
import { add, remove, clear, only } from '../actions/selection';

export type SelectionState = Set<string>;
const defaultState = new Set<string>();

export default createReducer(defaultState)
  .handleAction(add, (state, action) => {
    const id = action.payload;
    if (!state.has(id)) {
      const selection = new Set(state);
      selection.add(id);
      return selection;
    }
    return state;
  })
  .handleAction(remove, (state, action) => {
    const id = action.payload;
    if (state.has(id)) {
      const selection = new Set(state);
      selection.delete(id);
      return selection;
    }
    return state;
  })
  .handleAction(clear, () => new Set<string>())
  .handleAction(only, (_, action) => new Set([action.payload]));
