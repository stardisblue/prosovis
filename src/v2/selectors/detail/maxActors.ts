import { createSelector } from 'reselect';
import { RootState } from '../../../reducers';
import { selectActors } from '../actors';

export const selectMaxActors = (state: RootState) => state.maxActors.max;

const selectCurr = (state: RootState) => state.maxActors.current;
export const selectCurrent = createSelector(
  selectCurr,
  selectActors,
  (current, actors) => (actors && current ? actors[current] : null)
);
