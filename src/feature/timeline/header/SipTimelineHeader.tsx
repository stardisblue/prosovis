import React from 'react';
import { Flex, FlexItem } from '../../../components/ui/Flex';
import { stopEventPropagation } from '../../../hooks/useClick';
import styled from 'styled-components/macro';

import { ActorPlaceSwitch } from './ActorPlaceSwitch';

const StyledDiv = styled.div`
  background-color: #f7f7f7;
`;

const SipTimelineHeader: React.FC = function () {
  return (
    <StyledDiv>
      <Flex className="text-center">
        <FlexItem className="pa1">
          <ActorPlaceSwitch />
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

export default SipTimelineHeader;
