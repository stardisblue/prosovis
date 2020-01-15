import React, { useMemo, useContext } from 'react';
import { VisTimeline } from './VisTimeline';
import _ from 'lodash';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import {
  useTimelineContext,
  GROUP_BY,
  TimelineContext
} from './TimelineContext';
import { Flex } from '../../components/ui/Flex';

export const SiprojurisTimeline: React.FC = function() {
  const { types } = useContext(SiprojurisContext);
  const timelineContext = useTimelineContext(types);
  const { setGroup, displayTypes, toggle, border, color } = timelineContext;

  return (
    <>
      <div id="timeline-top">
        <Flex className="text-center">
          <div className="w-25 pa1">
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
          </div>
          <div className="w-75">
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
                  <div className="row">
                    <div className="col">
                      <input
                        id="no-end"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="no-end"
                        defaultChecked
                      />
                      <label htmlFor="no-end" className="d-inline">
                        <div
                          className="vis-item vis-range legend no-end vis-readonly"
                          style={{ width: '60px', margin: '5px' }}
                        >
                          <div className="vis-item-overflow">
                            <div className="vis-item-content">
                              <div className="click-content"></div>
                            </div>
                          </div>
                        </div>
                        <div className="vis-item-visible-frame"></div>
                      </label>
                      <input
                        id="sur"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="sur"
                        defaultChecked
                      />
                      <label htmlFor="sur" className="d-inline">
                        <div
                          className="vis-item vis-box legend sur vis-readonly"
                          style={{ margin: '5px' }}
                        >
                          <div className="vis-item-content">
                            <div className="click-content"></div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="col">
                      <input
                        id="no-thi"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="no-thi"
                        defaultChecked
                      />
                      <label htmlFor="no-thi" className="d-inline">
                        <div
                          className="vis-item vis-range legend no-thi vis-readonly"
                          style={{ width: '60px', margin: '5px' }}
                        >
                          <div className="vis-item-overflow">
                            <div className="vis-item-content">
                              <div className="click-content"></div>
                            </div>
                          </div>
                        </div>
                        <div className="vis-item-visible-frame"></div>
                      </label>
                      <input
                        id="long-thi"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="long-thi"
                        defaultChecked
                      />
                      <label htmlFor="long-thi" className="d-inline">
                        <div
                          className="vis-item vis-range legend long-thi vis-readonly m-1"
                          style={{ width: '60px', margin: '5px' }}
                        >
                          <div className="vis-item-overflow">
                            <div className="vis-item-content">
                              <div className="click-content"></div>
                            </div>
                          </div>
                        </div>
                        <div className="vis-item-visible-frame"></div>
                      </label>
                    </div>
                    <div className="col">
                      <input
                        id="no-beg"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="no-beg"
                        defaultChecked
                      />
                      <label htmlFor="no-beg" className="d-inline">
                        <div
                          className="vis-item vis-range legend no-beg vis-readonly m-1"
                          style={{ width: '60px', margin: '5px' }}
                        >
                          <div className="vis-item-overflow">
                            <div className="vis-item-content"></div>
                          </div>
                        </div>
                        <div className="vis-item-visible-frame"></div>
                      </label>
                      <input
                        id="long-sur"
                        type="checkbox"
                        className="checkbox-temporality-event"
                        value="long-sur"
                        defaultChecked
                      />
                      <label htmlFor="long-sur" className="d-inline">
                        <div
                          className="vis-item vis-range legend long-sur vis-readonly m-1"
                          style={{ width: '60px', margin: '5px' }}
                        >
                          <div className="vis-item-overflow">
                            <div className="vis-item-content">
                              <div className="click-content"></div>
                            </div>
                          </div>
                        </div>
                        <div className="vis-item-visible-frame"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade show active"
                id="event"
                role="tabpanel"
                aria-labelledby="event-tab"
              >
                <div className="container-fluid text-left" id="event_filter">
                  <Flex justify="between" wrap>
                    {useMemo(
                      () =>
                        _.map(displayTypes, (state, key) => (
                          <Flex
                            tag="label"
                            className="db"
                            key={key}
                            wrap
                            items="baseline"
                          >
                            <input
                              id="no-beg"
                              type="checkbox"
                              className="checkbox-temporality-event"
                              value="no-beg"
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
                            <p>{key}</p>
                          </Flex>
                        )),
                      [displayTypes, toggle, border, color]
                    )}
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </Flex>
      </div>
      <TimelineContext.Provider value={timelineContext}>
        <VisTimeline />
      </TimelineContext.Provider>
    </>
  );
};
