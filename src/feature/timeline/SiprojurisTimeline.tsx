import React, { useMemo } from 'react';

import { VisTimeline } from './VisTimeline';
import { Flex, FlexItem } from '../../components/ui/Flex';
import KindList from '../kind/KindList';
import { useDispatch } from 'react-redux';
import { setGroup } from './timelineGroupSlice';

export const SiprojurisTimeline: React.FC = function() {
  const dispatch = useDispatch();

  const handleClick = useMemo(
    () => ({
      actor: function() {
        dispatch(setGroup('Actor'));
      },
      place: function() {
        dispatch(setGroup('NamedPlace'));
      }
    }),
    [dispatch]
  );

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
                value="group_person"
                onClick={handleClick.actor}
              >
                Personnes
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-wrap"
                value="group_place"
                onClick={handleClick.place}
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
                <KindList />
              </div>
            </div>
          </FlexItem>
        </Flex>
      </div>
      <VisTimeline />
    </>
  );
};

export default SiprojurisTimeline;
