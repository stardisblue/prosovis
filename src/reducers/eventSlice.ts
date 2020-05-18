import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent, Actor, getEvents } from '../data';
import _ from 'lodash';

export const eventSlice = createSlice({
  name: 'event',
  initialState: [] as AnyEvent[],
  reducers: {
    addActor(state, action: PayloadAction<Actor | Actor[]>) {
      console.log(action.payload);
      if (_.isArray(action.payload)) {
        return state.concat(_.flatMap(action.payload, getEvents));
      }
      return state.concat(getEvents(action.payload));
    },
    deleteActor(state, { payload }: PayloadAction<PrimaryKey>) {
      return state.filter(({ actor: { id } }) => id !== payload);
    },
  },
});

export const { addActor, deleteActor } = eventSlice.actions;

export default eventSlice.reducer;
