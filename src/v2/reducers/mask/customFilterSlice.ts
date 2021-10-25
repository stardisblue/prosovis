import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isNil, keyBy, map, pipe, uniq } from 'lodash/fp';

export type CustomFilterField = { value: string | null; count: number };

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
      return '' + v;
  }
}

export type CustomFilterType = {
  name: string;
  kinds: string[];
  values: _.Dictionary<CustomFilterField>;
};

const initialState: {
  selected: string | null;
  filters: _.Dictionary<CustomFilterType>;
} = { selected: null, filters: {} };
export const customFilterSlice = createSlice({
  name: 'custom-filter',
  initialState,
  reducers: {
    setDefault(state, { payload }: PayloadAction<string>) {
      state.selected = payload;
    },
    add(
      state,
      {
        payload: { selected, filter, values },
      }: PayloadAction<{
        selected: boolean;
        filter: string;
        values: CustomFilterField[];
      }>
    ) {
      state.filters[filter] = {
        name: filter,
        kinds: pipe(
          map(({ value }) => getFilterType(value)),
          uniq
        )(values),
        values: keyBy((v) => resolveCustomFilterTypes(v.value), values),
      };
      if (selected) state.selected = filter;
    },
    remove(state, { payload }: PayloadAction<string>) {
      delete state.filters[payload];
      if (state.selected === payload) state.selected = null;
    },
    toggle(state, { payload: [key, value] }: PayloadAction<[string, string]>) {
      if (state.filters[key]) {
        if (isNil(state.filters[key].values[value].value))
          state.filters[key].values[value].value = value;
        else state.filters[key].values[value].value = null;
      }
    },
  },
});

export default customFilterSlice.reducer;
export const {
  setDefault: setDefaultCustomFilter,
  add: addCustomFilter,
  remove: removeCustomFilter,
  toggle: toggleCustomFilter,
} = customFilterSlice.actions;
