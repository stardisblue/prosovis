import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers';
import { toggleSwitch } from '../../reducers/switchSlice';
import styled from 'styled-components/macro';

const StyledLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 100%;
`;

const StyledInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: gray;
  transition: 0.4s;
  border-radius: 8px;
`;

const StyledKnob = styled.span`
  position: absolute;
  content: '';
  height: calc(50% - 2px);
  width: 12px;
  left: 2px;
  top: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 6px;
`;

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
    <StyledLabel>
      <StyledInput
        type="checkbox"
        name="switch"
        id="toggle-switch"
        checked={switchState}
        onChange={handleCheck}
      />
      <StyledSlider>
        <StyledKnob
          style={{
            transform: `translateY(${switchState ? '0%' : '100%'})`
          }}
        />
      </StyledSlider>
    </StyledLabel>
  );
};

export default ColorSwitch;
