import React, { useMemo, useState, useCallback, useContext } from 'react';
import { VisTimeline, getStyles } from './VisTimeline';
import { AnyEvent, Ressource, PrimaryKey } from '../models';
import _ from 'lodash';
import { SiprojurisContext } from '../SiprojurisContext';

function groupByActor(a: AnyEvent) {
  return a.actor.id;
}

function groupByNamedPlace(a: any) {
  return a.localisation ? a.localisation.id : 0;
}

function groupsActor(events: AnyEvent[]) {
  return _(events)
    .uniqBy('actor.id')
    .map(e => e.actor)
    .value();
}

function groupsNamedPlace(events: AnyEvent[]) {
  return _(events)
    .uniqBy('localisation.id')
    .map(
      e =>
        (e as any).localisation || {
          id: 0,
          label: 'Inconnue',
          kind: 'NamedPlace'
        }
    )
    .value();
}
export const SiprojurisTimelineContext = React.createContext({} as any);

const GROUP_BY: { [k: string]: GroupingProps } = {
  actor: {
    groups: groupsActor,
    groupBy: groupByActor,
    kind: 'Actor'
  },
  localisation: {
    groups: groupsNamedPlace,
    groupBy: groupByNamedPlace,
    kind: 'NamedPlace'
  }
};

type GroupingProps = {
  groups: (events: AnyEvent[]) => Ressource[];
  groupBy: (a: AnyEvent) => PrimaryKey;
  kind: string;
};

export function useSiprojurisTimelineContext(
  types: string[]
): {
  grouping: GroupingProps;
  setGroup: React.Dispatch<React.SetStateAction<GroupingProps>>;
  displayTypes: _.Dictionary<any>;
  toggle: (typ: string) => void;
} {
  const [grouping, setGroup] = useState(GROUP_BY.actor);
  const [displayTypes, setDisplayTypes] = useState(() =>
    _(types)
      .map(t => [t, true])
      .fromPairs()
      .value()
  );

  const toggle = useCallback((typ: string) => {
    setDisplayTypes(state => {
      state[typ] = !state[typ];
      return { ...state };
    });
  }, []);

  return { grouping, setGroup, displayTypes, toggle };
}

export const SiprojurisTimeline: React.FC = function() {
  const { types } = useContext(SiprojurisContext);
  const timelineContext = useSiprojurisTimelineContext(types);
  const { setGroup, displayTypes, toggle } = timelineContext;

  return (
    <>
      <div id="timeline-top">
        <div className="container-fluid">
          <div className="row border text-center">
            <div className="col-3 border-0 p-1">
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
                  Grouper par personnes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm text-wrap"
                  name="display"
                  value="group_place"
                  onClick={() => setGroup(GROUP_BY.localisation)}
                >
                  Grouper par lieux
                </button>
              </form>
            </div>
            <div className="col-9 border-right p-0">
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
                    <div className="row">
                      {useMemo(
                        () =>
                          _.map(displayTypes, (state, key) => {
                            const colors = getStyles(_.kebabCase(key));
                            return (
                              <div key={key} className="col-4">
                                <label>
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
                                      backgroundColor: colors.background,
                                      borderColor: colors.border,
                                      height: '12px',
                                      width: '12px'
                                    }}
                                  ></i>
                                  {key}
                                </label>
                              </div>
                            );
                          }),
                        [displayTypes, toggle]
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiprojurisTimelineContext.Provider value={timelineContext}>
        <VisTimeline />
      </SiprojurisTimelineContext.Provider>
    </>
  );
};
