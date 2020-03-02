import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers';
import { toggleSwitch } from '../../reducers/switchSlice';
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding-left: 0.25em;
  height: 100%;
`;

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
  top: 0.25em;
  left: 0;
  right: 0;
  bottom: 0.25em;
  background-color: #2196f3;
  transition: 0.4s;
  border-radius: 8px;

  &:before {
    position: absolute;
    content: '';
    height: calc(50% - 2px);
    width: 12px;
    left: 2px;
    top: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 6px;
    transform: translateY(100%);

    ${StyledInput}:checked + & {
      transform: translateY(0%);
    }
  }

  ${StyledInput}:checked + & {
    /*background-color: #2196f3;*/
  }

  ${StyledInput}:focus + & {
    box-shadow: 0 0 1px #2196f3;
  }
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
    <StyledDiv>
      <StyledLabel>
        <StyledInput
          type="checkbox"
          name="switch"
          id="toggle-switch"
          checked={switchState}
          onChange={handleCheck}
        />
        <StyledSlider />
      </StyledLabel>
    </StyledDiv>
  );
};

export default ColorSwitch;
