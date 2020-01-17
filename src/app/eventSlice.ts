import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyEvent, Actor, ExamenEvent, DirectionalExamenEvent } from '../data';
import _ from 'lodash';

export const eventSlice = createSlice({
  name: 'siprojuris',
  initialState: [] as AnyEvent[],
  reducers: {
    addActor(state, action: PayloadAction<Actor>) {
      let events = [];
      events.push(
        ...action.payload.birth_set,
        ...action.payload.death_set,
        ...action.payload.education_set,
        ..._.map(
          action.payload.est_evalue_examen,
          ({ actor_evalue, ...rest }) => ({
            ...rest,
            actor_evalue,
            actor: actor_evalue
          })
        ),
        ..._.map(
          action.payload.evaluer_examen,
          ({ actor_evaluer, ...rest }) => ({
            ...rest,
            actor_evaluer,
            actor: actor_evaluer
          })
        ),
        ...action.payload.retirement_set,
        ...action.payload.suspensionactivity_set,
        ...action.payload.obtainqualification_set
      );

      events = _.map(events, e => {
        e.datation = _.sortBy(e.datation, 'clean_date');
        return e;
      });
      state.push(...events);
    }
  }
});

export const actions = eventSlice.actions;

export default eventSlice.reducer;
