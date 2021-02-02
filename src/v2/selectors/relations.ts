import { RootState } from '../../reducers';
import { createSelector } from 'reselect';

export const selectRelationsData = (state: RootState) => state.relationsData;

export const selectGraph = createSelector(
  selectRelationsData,
  (g) => g.relations
);
