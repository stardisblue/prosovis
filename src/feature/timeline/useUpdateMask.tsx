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
            start: start.toDateString(),
            end: end.toDateString(),
          })
        );
      }, 100);
    },
    [dispatch]
  );
  return updateMask;
}
