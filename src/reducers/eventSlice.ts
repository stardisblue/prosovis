import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryKey, AnyEvent, Actor } from '../data';
import _ from 'lodash';

function getEvents(actor: Actor): AnyEvent[] {
  const events = [];
  events.push(
    ...actor.birth_set,
    ...actor.death_set,
    ...actor.education_set,
    ..._.map(actor.est_evalue_examen, ({ actor_evalue, ...rest }) => ({
      ...rest,
      actor_evalue,
      actor: actor_evalue
    })),
    ..._.map(actor.evaluer_examen, ({ actor_evaluer, ...rest }) => ({
      ...rest,
      actor_evaluer,
      actor: actor_evaluer
    })),
    ...actor.retirement_set,
    ...actor.suspensionactivity_set,
    ...actor.obtainqualification_set
  );

  return _.map(events, e => {
    e.datation = _.sortBy(e.datation, 'clean_date');
    return e;
  });
}

export const eventSlice = createSlice({
  name: 'event',
  initialState: [] as AnyEvent[],
  reducers: {
    addActor: {
      prepare: function(actor: Actor) {
        return { payload: getEvents(actor) };
      },
      reducer: function(state, action: PayloadAction<AnyEvent[]>) {
        return state.concat(action.payload);
      }
    },
    deleteActor(state, { payload }: PayloadAction<PrimaryKey>) {
      return state.filter(({ actor: { id } }) => id !== payload);
    }
  }
});
