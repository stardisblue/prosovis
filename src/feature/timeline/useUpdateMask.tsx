import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setIntervalMask } from '../../reducers/maskSlice';
import _ from 'lodash';

export function useUpdateMask() {
  const dispatch = useDispatch();
  const updateMask = useMemo(
    function () {
      return _.throttle((start: Date, end: Date) => {
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
