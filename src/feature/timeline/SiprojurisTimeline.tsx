import React, { useMemo, useContext } from 'react';
import { VisTimeline } from './VisTimeline';
import _ from 'lodash';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import {
  useTimelineContext,
  GROUP_BY,
  TimelineContext
} from './TimelineContext';
import { Flex, FlexItem } from '../../components/ui/Flex';
import { ColorContext } from '../../context/ColorContext';

export const SiprojurisTimeline: React.FC = function() {
  const { border, color } = useContext(ColorContext);
  const { types } = useContext(SiprojurisContext);
  const timelineContext = useTimelineContext(types);
  const { setGroup, displayTypes, toggle } = timelineContext;

  return (
    <>
      <div id="timeline-top">
        <Flex className="text-center">
          <FlexItem className="pa1">
            <div>Grouper par </div>
            <form
              name="group_display"
              className="btn-group"
              role="group"
              aria-label="Display of groups"
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm text-wrap"
                name="display"
                value="group_person"
                onClick={() => setGroup(GROUP_BY.actor)}
              >
                Personnes
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-wrap"
                name="display"
                value="group_place"
                onClick={() => setGroup(GROUP_BY.localisation)}
              >
                Lieux
              </button>
            </form>
          </FlexItem>
          <FlexItem auto>
            <ul className="nav nav-tabs pt-1" id="myTab" role="tablist">
              <li className="badge nav-item p-0 ml-1">
                <a
                  className="nav-link text-secondary"
                  id="tempo-tab"
                  data-toggle="tab"
                  href="#tempo"
                  role="tab"
                  aria-controls="tempo"
                  aria-selected="true"
                >
                  Temporalité
                </a>
              </li>
              <li className="badge nav-item p-0">
                <a
                  className="nav-link text-secondary active"
                  id="event-tab"
                  data-toggle="tab"
                  href="#event"
                  role="tab"
                  aria-controls="event"
                  aria-selected="false"
                >
                  Evènements
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className="tab-pane fade"
                id="tempo"
                role="tabpanel"
                aria-labelledby="tempo-tab"
              >
                <div className="container-fluid text-left">
                  <Flex wrap justify="between">
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
                          position: 'relative'
                        }}
                      ></div>
                    </Flex>
                    <Flex tag="label" className="ph2" col items="baseline">
                      <input
                        id="sur"
                        type="checkbox"
                        value="sur"
                        defaultChecked
                      />
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
                </div>
              </div>
              <div
                className="tab-pane fade show active "
                id="event"
                role="tabpanel"
                aria-labelledby="event-tab"
              >
                <Flex className="ph2" justify="between" wrap>
                  {useMemo(
                    () =>
                      _.map(displayTypes, (state, key) => (
                        <Flex
                          key={key}
                          tag="label"
                          className="ph2"
                          col
                          items="baseline"
                        >
                          <input
                            id="no-beg"
                            type="checkbox"
                            className="checkbox-temporality-event"
                            checked={state}
                            onChange={() => toggle(key)}
                          />
                          <i
                            className="br-100 mh1 dib ba"
                            style={{
                              backgroundColor: color(key),
                              borderColor: border(key),
                              height: '12px',
                              width: '12px'
                            }}
                          ></i>
                          {key}
                        </Flex>
                      )),
                    [displayTypes, toggle, border, color]
                  )}
                </Flex>
              </div>
            </div>
          </FlexItem>
        </Flex>
      </div>
      <TimelineContext.Provider value={timelineContext}>
        <VisTimeline />
      </TimelineContext.Provider>
    </>
  );
};

export default SiprojurisTimeline;
