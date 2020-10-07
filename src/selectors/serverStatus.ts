import { RootState } from '../reducers';

export const selectServerStatus = (state: RootState) => state.serverStatus;
