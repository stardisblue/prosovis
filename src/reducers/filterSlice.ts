import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey } from '../data';
import _ from 'lodash';
type Filters = 'kind' | 'timeInterval';

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {} as {
    current: { [k in Filters]: PrimaryKey[] };
  },
  reducers: {
    setFilter: {
      reducer: function(
        { current },
        action: PayloadAction<{ key: Filters; values: PrimaryKey[] }>
      ) {
        current[action.payload.key] = action.payload.values;
        return { current };
      },
      prepare: function(key: Filters, values: PrimaryKey[]) {
        return {
          payload: {
            key,
            values: _(values)
              .sortBy('id')
              .sortedUniqBy('id')
              .value()
          }
        };
      }
    },
    reset: function() {
      return { current: { kind: [], timeInterval: [] } };
    }
  }
});

export const { setFilter, reset } = filterSlice.actions;

export default filterSlice.reducer;
