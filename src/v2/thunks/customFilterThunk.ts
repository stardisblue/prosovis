import { ThunkAction } from '@reduxjs/toolkit';
import { sortBy, pipe, transform, get } from 'lodash/fp';
import { Action } from 'redux';
import { RootState } from '../../reducers';
import { selectRichEvents } from '../selectors/events';
import {
  addCustomFilter,
  CustomFilterField,
} from '../reducers/mask/customFilterSlice';
import { RichEvent } from '../types/events';

export const addCustomFilterThunk = function (
  payload:
    | {
        selected: boolean;
        filter: string;
      }
    | string
): ThunkAction<void, RootState, unknown, Action<string>> {
  const filter = typeof payload === 'string' ? payload : payload.filter;
  const selected = typeof payload !== 'string' && payload.selected;

  return (dispatch, getState) => {
    const state = getState();

    const events = selectRichEvents(state);
    const values = pipe(
      transform<RichEvent, _.Dictionary<CustomFilterField>>((acc, v) => {
        const key = get(filter, v);
        (acc[key] ?? (acc[key] = { value: key, count: 0 })).count++;
      }, {}),
      sortBy<CustomFilterField>('value')
    )(events!);

    dispatch(addCustomFilter({ selected, filter, values }));
  };
};
