import React, { useCallback } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { toggleKindMask } from '../../reducers/maskSlice';
import { AnyEvent } from '../../data';
import { selectMainColor, selectBorderColor } from '../../selectors/color';
import { RootState } from '../../reducers';

const Kind: React.FC<{
  id: AnyEvent['kind'];
  state: boolean;
}> = function({ id, state }) {
  const dispatch = useDispatch();

  const icon = useSelector((state: RootState) => {
    return (
      <i
        className="br-100 mh1 dib ba"
        style={{
          backgroundColor: selectMainColor(state)(id),
          borderColor: selectBorderColor(state)(id),
          height: '12px',
          width: '12px'
        }}
      />
    );
  });

  const handleCheck = useCallback(() => {
    dispatch(toggleKindMask(id));
  }, [dispatch, id]);
  return (
    <Flex tag="label" className="ph2" col items="baseline">
      <input type="checkbox" checked={state} onChange={handleCheck} />
      {icon} {id}
    </Flex>
  );
};

export default Kind;
