import React from 'react';
import { SelectionEvent, setSelection } from '../reducers/selectionSlice';
import { useDispatch } from 'react-redux';

export function stopEventPropagation<E extends { stopPropagation: () => void }>(
  event: E
) {
  event.stopPropagation();
  return event;
}
export function useFlatClick(callback: React.MouseEventHandler) {
  return {
    //eslint-disable-next-line
    onClick: React.useCallback(flatEvent(callback), [callback]),
    onMouseUp: stopEventPropagation,
  };
}

export function useClickSelect(interactive: SelectionEvent | SelectionEvent[]) {
  const dispatch = useDispatch();
  return useFlatClick(() => dispatch(setSelection(interactive)));
}

export function flatEvent<T extends React.MouseEventHandler>(callback: T) {
  return (event: React.MouseEvent) => callback(stopEventPropagation(event));
}
