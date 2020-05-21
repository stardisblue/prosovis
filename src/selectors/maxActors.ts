import { RootState } from '../reducers';

export const selectMaxActors = (state: RootState) => state.maxActors.max;
