import { PrimaryKey, Actor, ActorCard } from '../data/models';
import { setCurrent, resetCurrent } from '../reducers/maxActorsSlice';
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from '../reducers';
import { selectActors } from '../selectors/event';
import _ from 'lodash';
import { addActor, deleteAddActors } from '../reducers/eventSlice';
import { selectMaxActors } from '../selectors/maxActors';
import {
  clearRelationSelection,
  selectRelationSelection,
} from '../feature/relation/selectionSlice';
import { fetchActor } from '../data/fetchActor';
import { setOffline, setOnline } from '../reducers/serverStatusSlice';

export const fetchActorThunk = function (
  payload: PrimaryKey
): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    fetchActor(payload)
      .then((response) => {
        dispatch(setOnline());
        const state = getState();
        const actors = selectActors(state);
        const maxSize = selectMaxActors(state);
        // console.log(response);
        if (actors[payload] === undefined) {
          if (_.size(actors) >= maxSize) dispatch(setCurrent(response.data));
          else dispatch(addActor(response.data));
        }
      })
      .catch(() => {
        dispatch(setOffline());
      });
  };
};

export const addActorsThunk = function (payload: {
  current: Actor;
  checkboxs: { actor: ActorCard; checked: boolean }[];
}): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const relationSelection = selectRelationSelection(getState());
    dispatch(
      deleteAddActors({
        delete: _(payload.checkboxs)
          .filter((v) => !v.checked)
          .map('actor.id')
          .value(),
        add: payload.current,
      })
    );
    if (
      relationSelection &&
      !_.find(
        payload.checkboxs,
        (chk) => chk.actor.id.toString() === relationSelection.actor.toString()
      )?.checked
    )
      dispatch(clearRelationSelection());
    dispatch(resetCurrent());
  };
};
