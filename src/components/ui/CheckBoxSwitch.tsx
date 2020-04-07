import React from 'react';
import styled from 'styled-components/macro';
import StyledInput from '../../feature/mask/StyledInput';
import { stopEventPropagation } from '../../hooks/useClick';

export const StyledLabel = styled.label`
  margin-bottom: 0;
  margin-right: 1em;
`;

export const StyledSlider = styled.div`
  display: inline-block;
  cursor: pointer;
  padding: 0.125em;
  height: 1em;
  width: 2em;
  transition: 0.4s;
  border-radius: 0.5em;
  background-color: #ccc;
`;

export const StyledKnob = styled.div<{ slide: boolean }>`
  height: 0.75em;
  width: 0.75em;
  background-color: white;
  transition: 0.4s;
  border-radius: 0.5em;
  ${(props) => (props.slide ? 'transform:translateX(1em)' : '')};
`;

export const StyledText = styled.div<{ sliderColor: string }>`
  display: inline-block;
  padding-bottom: 0.125em;
  vertical-align: bottom;
  margin-left: 0.125em;
  color: ${(props) => props.sliderColor};
  transition: 0.4s;
`;

const CheckBoxSwitch: React.FC<{
  checked: boolean;
  handleCheck: React.ChangeEventHandler;
  color: string;
}> = function ({ checked, handleCheck, children, color }) {
  return (
    <StyledLabel className="pointer" onMouseUp={stopEventPropagation}>
      <StyledInput type="checkbox" checked={checked} onChange={handleCheck} />
      <StyledSlider style={{ backgroundColor: checked ? color : undefined }}>
        <StyledKnob slide={checked} />
      </StyledSlider>
      <StyledText sliderColor={checked ? '' : '#ccc'}>{children}</StyledText>
    </StyledLabel>
  );
};

export default CheckBoxSwitch;
