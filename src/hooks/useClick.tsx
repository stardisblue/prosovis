import React from 'react';
import { SelectionEvent, setSelection } from '../reducers/selectionSlice';
import { useDispatch } from 'react-redux';

export function stopEventPropagation(event: React.MouseEvent) {
  event.stopPropagation();
  return event;
}
export function useFlatClick(callback: React.MouseEventHandler) {
  return {
    onClick: React.useCallback(flatEvent(callback), [callback]),
    onMouseUp: stopEventPropagation
  };
}

export function useClickSelect(interactive: SelectionEvent | SelectionEvent[]) {
  const dispatch = useDispatch();
  return useFlatClick(() => dispatch(setSelection(interactive)));
}

export function flatEvent<T extends React.MouseEventHandler>(callback: T) {
  return (event: React.MouseEvent) => callback(stopEventPropagation(event));
}
