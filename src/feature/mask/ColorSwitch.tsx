import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers';
import { toggleSwitch } from '../../reducers/switchSlice';
import styled from 'styled-components/macro';
import StyledInput from './StyledInput';

const StyledLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 1em;
  height: 100%;
  margin-bottom: 0;
`;

const StyledSlider = styled.div`
  cursor: pointer;
  height: 100%;
  width: 100%;
  padding: 12.5%;
  background-color: #333;
  transition: 0.4s;
  border-radius: 999em;
`;

const StyledKnob = styled.div<{ slide: boolean }>`
  height: 50%;
  background-color: white;
  transition: 0.4s;
  border-radius: 999em;
  transform: translateY(${props => (props.slide ? '0%' : '100%')});
`;

const switchIsActor = (state: RootState) => state.switch === 'Actor';

const ColorSwitch: React.FC = function() {
  const dispatch = useDispatch();

  const switchState = useSelector(switchIsActor);

  const handleCheck = useCallback(() => {
    dispatch(toggleSwitch());
  }, [dispatch]);

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
        <StyledKnob slide={switchState} />
      </StyledSlider>
    </StyledLabel>
  );
};

export default ColorSwitch;
