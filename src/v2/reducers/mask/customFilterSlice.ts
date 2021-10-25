import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isNil, keyBy, map, pipe, uniqBy } from 'lodash/fp';

export function getFilterType(v: string | number | object | undefined | null) {
  switch (typeof v) {
    case 'object':
      if (Array.isArray(v)) return 'array';
      return 'object';
    default:
      return typeof v;
  }
}

export function resolveCustomFilterTypes(
  v: string | number | Object | undefined | null
) {
  switch (typeof v) {
    case 'object':
      if (Array.isArray(v)) return '' + v.length;
      return 'is defined';
    case 'undefined':
      return 'undefined';
    case 'number':
      return '' + v;
    default:
      return v;
  }
}

const initialState: _.Dictionary<{
  kinds: string[];
  values: _.Dictionary<string | null>;
}> = {};
export const customFilterSlice = createSlice({
  name: 'custom-filter',
  initialState,
  reducers: {
    add(state, { payload: [value, dict] }: PayloadAction<[string, string[]]>) {
      state[value] = {
        kinds: pipe(uniqBy(getFilterType), map(getFilterType))(dict),
        values: keyBy<string>((v) => resolveCustomFilterTypes(v), dict),
      };
    },
    remove(state, { payload }: PayloadAction<string>) {
      delete state[payload];
    },
    toggle(state, { payload: [key, value] }: PayloadAction<[string, string]>) {
      if (state[key]) {
        if (isNil(state[key].values[value])) state[key].values[value] = value;
        else state[key].values[value] = null;
      }
    },
  },
});

export default customFilterSlice.reducer;
export const {
  add: addCustomFilter,
  remove: removeCustomFilter,
  toggle: toggleCustomFilter,
} = customFilterSlice.actions;
