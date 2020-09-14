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
import classnames from 'classnames';
import styled from 'styled-components/macro';
import { darkgray, lightgray } from '../../../components/ui/colors';

export const PaddedStyledText = styled(StyledText)`
  padding-left: 0.125em;
  padding-right: 0.125em;
  font-size: 0.75em;
  font-weight: 700;
`;

export const AdaptedSlider = styled(StyledSlider)`
  background-color: ${darkgray};
`;

export const ActorPlaceSwitch: React.FC<{ className?: string }> = function ({
  className,
}) {
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
    <StyledLabel
      className={classnames('pointer', className)}
      onMouseUp={stopEventPropagation}
    >
      <StyledInput
        type="checkbox"
        checked={checked}
        onChange={handleGroupSwitch}
      />
      <PaddedStyledText sliderColor={checked ? lightgray : ''}>
        Personnes
      </PaddedStyledText>
      <AdaptedSlider>
        <StyledKnob slide={checked} />
      </AdaptedSlider>
      <PaddedStyledText sliderColor={checked ? '' : lightgray}>
        Lieux
      </PaddedStyledText>
    </StyledLabel>
  );
};

export default ActorPlaceSwitch;
