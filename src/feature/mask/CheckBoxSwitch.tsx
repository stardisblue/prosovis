import React from 'react';
import styled from 'styled-components/macro';

const StyledLabel = styled.label`
  position: relative;
  margin-bottom: 0;
`;

const StyledInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  left: 0;
  top: 0.25em;
  bottom: 0.25em;
  width: 32px;
  transition: 0.4s;
  border-radius: 8px;
  background-color: #ccc;
`;

const StyledKnob = styled.span<{ slide: boolean }>`
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 2px;
  top: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 6px;
  ${props => (props.slide ? 'transform:translateX(16px)' : '')};
`;

const StyledText = styled.span<{ sliderColor: string }>`
  margin-left: 22px;
  color: ${props => props.sliderColor};
`;

const CheckBoxSwitch: React.FC<{
  checked: boolean;
  handleCheck: () => void;
  color: string;
}> = function({ checked, handleCheck, children, color }) {
  return (
    <StyledLabel>
      <StyledInput type="checkbox" checked={checked} onChange={handleCheck} />
      <StyledSlider style={{ backgroundColor: checked ? color : undefined }}>
        <StyledKnob slide={checked} />
      </StyledSlider>
      <StyledText sliderColor={checked ? 'black' : '#ccc'}>
        {children}
      </StyledText>
    </StyledLabel>
  );
};

export default CheckBoxSwitch;
