import { ThunkAction } from '@reduxjs/toolkit';
import { sortBy, identity, map, pipe, uniqBy } from 'lodash/fp';
import { Action } from 'redux';
import { RootState } from '../../reducers';
import { selectRichEvents } from '../selectors/events';
import { RichEvent } from '../types/events';
import { addCustomFilter } from '../reducers/mask/customFilterSlice';

export const addCustomFilterThunk = function (
  payload: string
): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const state = getState();

    const events = selectRichEvents(state);
    const values = pipe(
      uniqBy<RichEvent>(payload),
      map(payload),
      sortBy(identity)
    )(events);

    dispatch(addCustomFilter([payload, values]));
  };
};
