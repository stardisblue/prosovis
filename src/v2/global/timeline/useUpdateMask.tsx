import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { setMaskGlobalTime } from '../../reducers/mask/globalTimeSlice';

export function useUpdateMaskGlobalTime() {
  const dispatch = useDispatch();
  return useMemo(
    () =>
      _.throttle((start: Date, end: Date) => {
        dispatch(setMaskGlobalTime({ start, end }));
      }, 1000),
    [dispatch]
  );
}
