import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGroup } from '../timelineGroupSlice';
import { stopEventPropagation } from '../../../hooks/useClick';
import StyledInput from '../../mask/StyledInput';
import {
  StyledLabel,
  StyledKnob,
  StyledText,
  StyledSlider,
} from '../../../components/ui/CheckBoxSwitch';
import styled from 'styled-components/macro';

export const PaddedStyledText = styled(StyledText)`
  padding-left: 0.125em;
  padding-right: 0.125em;
`;

export const AdaptedSlider = styled(StyledSlider)`
  background-color: #6c757d;
`;

export const ActorPlaceSwitch: React.FC = function () {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const handleGroupSwitch = useCallback(() => {
    setChecked((s) => !s);
  }, []);
  useEffect(
    function () {
      if (checked) {
        dispatch(setGroup('NamedPlace'));
      } else {
        dispatch(setGroup('Actor'));
      }
    },
    [dispatch, checked]
  );
  return (
    <StyledLabel className="pointer" onMouseUp={stopEventPropagation}>
      <StyledInput
        type="checkbox"
        checked={checked}
        onChange={handleGroupSwitch}
      />
      <PaddedStyledText sliderColor={checked ? '#ccc' : ''}>
        Personnes
      </PaddedStyledText>
      <AdaptedSlider>
        <StyledKnob slide={checked} />
      </AdaptedSlider>
      <PaddedStyledText sliderColor={checked ? '' : '#ccc'}>
        Lieux
      </PaddedStyledText>
    </StyledLabel>
  );
};
