import React, { useCallback } from 'react';
import { Flex } from '../../components/ui/Flex';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers';
import { toggleSwitch } from '../../reducers/switchSlice';

const ColorSwitch: React.FC = function() {
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
    </Flex>
  );
};

export default ColorSwitch;
