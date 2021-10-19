import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProsoVisActor } from '../../types/actors';

type ActorId = ProsoVisActor['id'];
export const detailActorSlice = createSlice({
  name: 'detail/actor',
  initialState: [] as ActorId[],
  reducers: {
    reset() {
      return [];
    },
    add(state, { payload }: PayloadAction<ActorId | ActorId[]>) {
      if (Array.isArray(payload))
        return Array.from(new Set(state.concat(payload)));
      else return Array.from(new Set(state.concat([payload])));
    },
    remove(state, { payload }: PayloadAction<ActorId | ActorId[]>) {
      if (Array.isArray(payload))
        return state.filter((v) => payload.includes(v));
      return state.filter((v) => v !== payload);
    },
  },
});

export default detailActorSlice.reducer;

export const {
  reset: resetDetailActor,
  add: addDetailActor,
  remove: removeDetailActor,
} = detailActorSlice.actions;
