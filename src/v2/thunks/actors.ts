import { Action, ThunkAction } from '@reduxjs/toolkit';
import { filter, find, flow, map, size } from 'lodash/fp';
import {
  clearRelationSelection,
  selectRelationSelection,
} from '../../feature/relation/selectionSlice';
import { RootState } from '../../reducers';
import {
  addDetailActor,
  removeDetailActor,
} from '../reducers/detail/actorSlice';
import { resetCurrent, setCurrent } from '../reducers/detail/maxActorsSlice';
import { selectDetailActorIds } from '../selectors/detail/actors';
import { selectMaxActors } from '../selectors/detail/maxActors';
import { ProsoVisActor } from '../types/actors';

export const tryAddDetailActorThunk = function (
  payload: string
): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const state = getState();

    const existing = selectDetailActorIds(state);
    const maxSize = selectMaxActors(state);
    if (size(existing) >= maxSize) dispatch(setCurrent(payload));
    else dispatch(addDetailActor(payload));
  };
};

type CheckType = { actor: ProsoVisActor; checked: boolean };

export const validateDetailActorsThunk = function (payload: {
  current: ProsoVisActor;
  checkboxs: _.Dictionary<CheckType>;
}): ThunkAction<void, RootState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const relationSelection = selectRelationSelection(getState());
    console.log(payload);
    flow(
      filter((v: CheckType) => v.checked),
      map((v: CheckType) => v.actor.id),
      removeDetailActor,
      dispatch
    )(payload.checkboxs);
    dispatch(addDetailActor(payload.current.id));
    if (
      relationSelection &&
      !find(
        (chk) => chk.actor.id === relationSelection.actor,
        payload.checkboxs
      )?.checked
    )
      dispatch(clearRelationSelection());
    dispatch(resetCurrent());
  };
};
