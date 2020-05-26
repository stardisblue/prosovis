import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent, Actor, getEvents } from '../data';
import _ from 'lodash';

export const eventSlice = createSlice({
  name: 'event',
  initialState: [] as AnyEvent[],
  reducers: {
    addActor(state, action: PayloadAction<Actor | Actor[]>) {
      if (_.isArray(action.payload)) {
        return state.concat(_.flatMap(action.payload, getEvents));
      }
      return state.concat(getEvents(action.payload));
    },
    deleteActor(state, { payload }: PayloadAction<PrimaryKey | PrimaryKey[]>) {
      if (_.isArray(payload)) {
        return state.filter(({ actor: { id } }) =>
          _.every(payload, (actor) => actor.toString() !== id.toString())
        );
      }
      return state.filter(({ actor: { id } }) => id !== payload);
    },
    deleteAddActors(
      state,
      {
        payload,
      }: PayloadAction<{
        delete: PrimaryKey | PrimaryKey[];
        add: Actor | Actor[];
      }>
    ) {
      let cleaned;
      const deletes = payload.delete;
      if (_.isArray(deletes)) {
        cleaned = state.filter(({ actor: { id } }) =>
          _.every(deletes, (actor) => actor.toString() !== id.toString())
        );
      } else {
        cleaned = state.filter(({ actor: { id } }) => id !== deletes);
      }

      const adds = payload.add;

      if (_.isArray(adds)) {
        return _.concat(cleaned, _.flatMap(adds, getEvents));
      }
      return _.concat(cleaned, getEvents(adds));
    },
  },
});

export const { addActor, deleteActor, deleteAddActors } = eventSlice.actions;

export default eventSlice.reducer;
