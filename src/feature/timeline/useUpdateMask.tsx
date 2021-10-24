import { throttle } from 'lodash';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setIntervalMask } from '../../reducers/maskSlice';

export function useUpdateMask() {
  const dispatch = useDispatch();
  const updateMask = useMemo(
    function () {
      return throttle((start: Date, end: Date) => {
        dispatch(
          setIntervalMask({
            start: start.toISOString(),
            end: end.toISOString(),
          })
        );
      }, 100);
    },
    [dispatch]
  );
  return updateMask;
}
