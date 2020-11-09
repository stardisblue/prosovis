import { RootState } from '../../reducers';
import { createSelector } from 'reselect';

export const selectGraphData = (state: RootState) => state.graphData;

export const selectGraph = createSelector(selectGraphData, (g) => g.graph);
