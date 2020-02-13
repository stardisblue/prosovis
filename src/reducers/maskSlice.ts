import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyEvent } from '../data';
import _ from 'lodash';
import moment from 'moment';
type Filters = 'kind' | 'interval';

export const maskSlice = createSlice({
  name: 'filters',
  initialState: { kind: () => true, interval: () => true } as {
    [k in Filters]?: (e: AnyEvent) => boolean;
  },
  reducers: {
    setIntervalMask: function(
      state,
      { payload: { start, end } }: PayloadAction<{ start: string; end: string }>
    ) {
      return {
        ...state,
        interval: ({ datation }: AnyEvent) =>
          _.some(datation, ({ clean_date }) =>
            moment(clean_date).isBetween(start, end)
          )
      };
    },
    setKindMask: function(
      state,
      action: PayloadAction<{ [k in AnyEvent['kind']]: boolean }>
    ) {
      return { ...state, kind: (e: AnyEvent) => action.payload[e.kind] };
    },

    clearMask: function() {
      return {};
    }
  }
});

export const { setIntervalMask, setKindMask, clearMask } = maskSlice.actions;

export default maskSlice.reducer;
