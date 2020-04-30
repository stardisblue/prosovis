import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectRelations } from './selectRelations';
import { RelationMap } from './models';

type Selection = {
  actor: number;
  loc: number;
};
export const selectionSlice = createSlice({
  name: 'relation/selection',
  initialState: null as Selection | null,
  reducers: {
    setRelationSelection(_, action: PayloadAction<Selection>) {
      return action.payload;
    },
    clearRelationSelection() {
      return null;
    },
  },
});

export const selectRelationSelection = (state: RootState) =>
  state.relationSelection;

const emptymap: { ghosts: RelationMap; links: RelationMap } = {
  ghosts: new Map(),
  links: new Map(),
};
export const selectSelectedGhosts = createSelector(
  selectRelations,
  selectRelationSelection,
  ({ actorRing, locLinks, actors }, selection) => {
    if (!selection) return emptymap;

    const actor = actorRing.get(selection.actor);

    if (!actor) return emptymap;

    const ghosts = actor.locsLinks.get(selection.loc)!;
    const links = new Map();

    const linksForPlace = locLinks.get(selection.loc)!;

    // foreach actor in links, check the connection they have(with ghosts or actors)
    actor.locsLinks.get(selection.loc)!.forEach((link) => {
      actors.forEach((actor) => {
        if (actor.id === selection.actor) return;
        const found = linksForPlace.get(
          [actor.id, link.target].sort().join(':')
        );
        if (found) links.set(found.id, found);
      });
    });
    console.log();

    return { ghosts, links };
  }
);

export const {
  setRelationSelection,
  clearRelationSelection,
} = selectionSlice.actions;

export default selectionSlice.reducer;
