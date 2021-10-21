import { throttle } from 'lodash/fp';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setMaskGlobalTime } from '../../reducers/mask/globalTimeSlice';

export function useUpdateMaskGlobalTime() {
  const dispatch = useDispatch();
  return useMemo(
    () =>
      throttle(100, (start: Date, end: Date) => {
        dispatch(setMaskGlobalTime({ start, end }));
      }),
    [dispatch]
  );
}
