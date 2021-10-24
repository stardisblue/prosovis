import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

import { keyBy, map, pickBy, pipe, uniqBy } from 'lodash/fp';
import { Action } from 'redux';
import { RootState } from '../../../reducers';
import { selectRichEvents } from '../../selectors/events';
import { RichEvent } from '../../types/events';

const initialState: _.Dictionary<_.Dictionary<string>> = {};

export const tryAddDetailActorThunk = function (
  payload: string
): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const state = getState();

    const events = selectRichEvents(state);
    const values = pipe(uniqBy<RichEvent>(payload), map(payload))(events);

    dispatch(
      maskFilterSlice.actions.add([payload, keyBy<string>(payload, values)])
    );
  };
};

const maskFilterSlice = createSlice({
  name: 'mask-filter',
  initialState,
  reducers: {
    add(
      state,
      { payload: [value, dict] }: PayloadAction<[string, _.Dictionary<string>]>
    ) {
      return { ...state, [value]: dict };
    },
    remove(state, { payload }: PayloadAction<string>) {
      return pickBy((_v, k) => k !== payload, state);
    },
    toggle(state, { payload: [key, value] }: PayloadAction<[string, string]>) {
      if (state[key]) {
        state[key] = pickBy((v) => v !== value, state[key]);
      } else {
        state[key][value] = value;
      }
    },
  },
});

export default maskFilterSlice.reducer;
export const { toggle: togglemaskFilter } = maskFilterSlice.actions;
