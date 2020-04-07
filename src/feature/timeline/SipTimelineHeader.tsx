import React, { useState, useCallback, useEffect } from 'react';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { useDispatch } from 'react-redux';
import { setGroup } from './timelineGroupSlice';
import { stopEventPropagation } from '../../hooks/useClick';
import styled from 'styled-components/macro';
import StyledInput from '../mask/StyledInput';

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

const StyledLabel = styled.label`
  margin-bottom: 0;
  margin-right: 1em;
`;

const StyledSlider = styled.div`
  display: inline-block;
  cursor: pointer;
  padding: 0.125em;
  height: 1em;
  width: 2em;
  transition: 0.4s;
  border-radius: 0.5em;
  background-color: #6c757d;
`;

const StyledKnob = styled.div<{ slide: boolean }>`
  height: 0.75em;
  width: 0.75em;
  background-color: white;
  transition: 0.4s;
  border-radius: 0.5em;
  ${(props) => (props.slide ? 'transform:translateX(1em)' : '')};
`;

const StyledText = styled.div<{ sliderColor: string }>`
  display: inline-block;
  padding-bottom: 0.125em;
  vertical-align: bottom;
  margin-left: 0.125em;
  color: ${(props) => props.sliderColor};
  transition: 0.4s;
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
      <StyledText sliderColor={checked ? '#ccc' : ''}>{actor}</StyledText>
      <StyledSlider>
        <StyledKnob slide={checked} />
      </StyledSlider>
      <StyledText sliderColor={checked ? '' : '#ccc'}>{place}</StyledText>
    </StyledLabel>
  );
};

export default SipTimelineHeader;
