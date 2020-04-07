import React, { useState, useCallback, useEffect } from 'react';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { useDispatch } from 'react-redux';
import { setGroup } from './timelineGroupSlice';
import { stopEventPropagation } from '../../hooks/useClick';
import styled from 'styled-components/macro';
import StyledInput from '../mask/StyledInput';
import {
  StyledLabel,
  StyledText,
  StyledKnob,
  StyledSlider,
} from '../../components/ui/CheckBoxSwitch';

const StyledDiv = styled.div`
  background-color: #f7f7f7;
`;

const SipTimelineHeader: React.FC = function () {
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
    <StyledDiv>
      <Flex className="text-center">
        <FlexItem className="pa1">
          <CheckBoxSwitch
            checked={checked}
            handleCheck={handleGroupSwitch}
            actor="Personnes"
            place="Lieux"
          />
        </FlexItem>
        <FlexItem auto>
          <Flex wrap justify="between" onMouseUp={stopEventPropagation}>
            <Flex tag="label" className="ph2" col items="baseline">
              <input
                id="no-end"
                type="checkbox"
                value="no-end"
                defaultChecked
              />
              <div
                className="ma2 vis-item vis-range legend sipt--no-end"
                style={{
                  width: '60px',
                  position: 'relative',
                }}
              ></div>
            </Flex>
            <Flex tag="label" className="ph2" col items="baseline">
              <input id="sur" type="checkbox" value="sur" defaultChecked />
              <div
                className="ma2 vis-item vis-box legend sipt--sur vis-readonly"
                style={{ position: 'relative' }}
              ></div>
            </Flex>
            <Flex tag="label" className="ph2" col items="baseline">
              <input
                id="no-thi"
                type="checkbox"
                className="checkbox-temporality-event"
                value="no-thi"
                defaultChecked
              />
              <div
                className="ma2 vis-item vis-range legend sipt--no-thi vis-readonly"
                style={{ width: '60px', position: 'relative' }}
              ></div>
            </Flex>
            <Flex tag="label" className="ph2" col items="baseline">
              <input
                id="long-thi"
                type="checkbox"
                className="checkbox-temporality-event"
                value="long-thi"
                defaultChecked
              />
              <div
                className="vis-item vis-range legend sipt--long-thi vis-readonly ma2"
                style={{ width: '60px', position: 'relative' }}
              >
                <div className="vis-item-overflow">
                  <div className="vis-item-content">
                    <div className="click-content"></div>
                  </div>
                </div>
              </div>
            </Flex>
            <Flex tag="label" className="ph2" col items="baseline">
              <input
                id="no-beg"
                type="checkbox"
                className="checkbox-temporality-event"
                value="no-beg"
                defaultChecked
              />
              <div
                className="vis-item vis-range legend sipt--no-beg vis-readonly ma2"
                style={{ width: '60px', position: 'relative' }}
              >
                <div className="vis-item-overflow">
                  <div className="vis-item-content"></div>
                </div>
              </div>
              <div className="vis-item-visible-frame"></div>
            </Flex>
            <Flex tag="label" className="ph2" col items="baseline">
              <input
                id="long-sur"
                type="checkbox"
                className="checkbox-temporality-event"
                value="long-sur"
                defaultChecked
              />
              <div
                className="vis-item vis-range sipt--long-sur vis-readonly ma2"
                style={{ width: '60px', position: 'relative' }}
              >
                <div className="vis-item-overflow">
                  <div className="vis-item-content">
                    <div className="click-content"></div>
                  </div>
                </div>
              </div>
            </Flex>
          </Flex>
        </FlexItem>
      </Flex>
    </StyledDiv>
  );
};

const PaddedStyledText = styled(StyledText)`
  padding-left: 0.125em;
  padding-right: 0.125em;
`;

const AdaptedSlider = styled(StyledSlider)`
  background-color: #6c757d;
`;

export const CheckBoxSwitch: React.FC<{
  checked: boolean;
  handleCheck: React.ChangeEventHandler;
  actor: string;
  place: string;
}> = function ({ checked, handleCheck, actor, place }) {
  return (
    <StyledLabel className="pointer" onMouseUp={stopEventPropagation}>
      <StyledInput type="checkbox" checked={checked} onChange={handleCheck} />
      <PaddedStyledText sliderColor={checked ? '#ccc' : ''}>
        {actor}
      </PaddedStyledText>
      <AdaptedSlider>
        <StyledKnob slide={checked} />
      </AdaptedSlider>
      <PaddedStyledText sliderColor={checked ? '' : '#ccc'}>
        {place}
      </PaddedStyledText>
    </StyledLabel>
  );
};

export default SipTimelineHeader;
