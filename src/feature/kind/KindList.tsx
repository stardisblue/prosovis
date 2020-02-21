import React, { useCallback } from 'react';
import _ from 'lodash';
import { Flex } from '../../components/ui/Flex';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AnyEvent } from '../../data';
import { selectKindMask } from '../../selectors/mask';
import Kind from './Kind';
import { RootState } from '../../reducers';
import { toggleSwitch } from '../../reducers/switchSlice';

type KindMask = {
  [k in AnyEvent['kind']]: boolean;
};

const KindList: React.FC<{ kinds?: KindMask }> = function({ kinds }) {
  const dispatch = useDispatch();

  const switchState = useSelector(
    (state: RootState) => state.switch === 'Actor'
  );

  const handleCheck = useCallback(
    function() {
      dispatch(toggleSwitch());
    },
    [dispatch]
  );

  return (
    <Flex className="ph2" justify="between" wrap>
      <label>
        <input
          type="checkbox"
          name="switch"
          id="toggle-switch"
          checked={switchState}
          onChange={handleCheck}
        />
        toggle Actors
      </label>
      {_.map(kinds, (state, id: AnyEvent['kind']) => (
        <Kind key={id} id={id} state={state} />
      ))}
    </Flex>
  );
};

export default connect((state: RootState) => ({
  kinds: selectKindMask(state)
}))(KindList);
