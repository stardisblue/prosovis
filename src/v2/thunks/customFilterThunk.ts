import { ThunkAction } from '@reduxjs/toolkit';
import { get, pipe, sortBy, transform } from 'lodash/fp';
import { Action } from 'redux';
import { RootState } from '../../reducers';
import {
  addCustomFilter,
  getFilterType,
  resolveCustomFilterTypes,
} from '../reducers/mask/customFilterSlice';
import { selectRichEvents } from '../selectors/events';
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
      transform<
        RichEvent,
        _.Dictionary<{ value: string; kind: string; count: number }>
      >((acc, v) => {
        const value = get(filter, v);
        const key = resolveCustomFilterTypes(value);
        (
          acc[key] ??
          (acc[key] = { value: key, kind: getFilterType(value), count: 0 })
        ).count++;
      }, {}),
      sortBy<{ value: string; kind: string; count: number }>('value')
    )(events!);

    dispatch(addCustomFilter({ selected, filter, values }));
  };
};
