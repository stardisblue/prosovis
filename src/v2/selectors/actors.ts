import { RootState } from '../../reducers';

export const selectActors = (state: RootState) => state.actorData.actors;
