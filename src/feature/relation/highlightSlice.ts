import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { selectRelations } from './selectRelations';
import { RelationMap } from './models';
import { selectRelationSelection } from './selectionSlice';

type Highlight = {
  actor: number;
  loc: number;
};
export const highlightSlice = createSlice({
  name: 'relation/highlight',
  initialState: null as Highlight | null,
  reducers: {
    setRelationHighlight(_, action: PayloadAction<Highlight>) {
      return action.payload;
    },
    clearRelationHighligh() {
      return null;
    },
  },
});

export const selectRelationHighlights = (state: RootState) =>
  state.relationHighlight;

const emptymap: { ghosts: RelationMap; links: RelationMap } = {
  ghosts: new Map(),
  links: new Map(),
};
export const selectHighlightedGhosts = createSelector(
  selectRelations,
  selectRelationHighlights,
  ({ actorRing, actors, locLinks }, selection) => {
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

export const selectRelationEmphasis = createSelector(
  selectRelationSelection,
  selectRelationHighlights,
  (rel, high) => (rel ? rel : high)
);

export const {
  setRelationHighlight,
  clearRelationHighligh,
} = highlightSlice.actions;

export default highlightSlice.reducer;
