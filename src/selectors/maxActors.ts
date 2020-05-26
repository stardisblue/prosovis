import { RootState } from '../reducers';

export const selectMaxActors = (state: RootState) => state.maxActors.max;

export const selectCurrent = (state: RootState) => state.maxActors.current;
