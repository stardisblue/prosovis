import 'bootstrap';
import classnames from 'classnames';
import he from 'he';
import $ from 'jquery';
import _ from 'lodash';
import { Moment } from 'moment';
import 'popper.js';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import vis from 'vis';
import { Datation, Nullable } from '../models';
import { AugmentedEvent, SiprojurisContext } from '../SiprojurisContext';
import './Timeline.css';

type VisEvent = {
  event: MouseEvent;
  item: Nullable<number | string>;
  group: Nullable<number | string>;
  what: Nullable<string>;
  pageX: number;
  pageY: number;
  x: number;
  y: number;
  time: Date;
  snappedTime: Moment;
};

function resolveDatation([start, end]: Datation[]): {
  start: string;
  end: Nullable<string>;
  type: string;
} {
  return {
    start: start.clean_date,
    end: end ? end.clean_date : null,
    type: end ? 'range' : 'box'
  };
}

function getStyles(str: string) {
  // "naissance", "qualite", "enseigne", "retraite", "deces", "chaire"
  const colorMapping: {
    [k: string]: { background: string; border: string };
  } = {
    // array of ten colors for items
    birth: {
      background: '#e0e1a8',
      border: '#666723'
    },
    'obtain-qualification': {
      background: '#a8a8e1',
      border: '#242367'
    },
    education: {
      background: '#e1a8a8',
      border: '#672423'
    },
    retirement: {
      background: '#a8e1a8',
      border: '#236724'
    },
    death: {
      background: '#e1a8e0',
      border: '#672366'
    },
    basic: {
      background: '#a8e0e1',
      border: ' #236667'
    }
    // {
    //   background: '#e1cba8',
    //   border: '#674d23'
    // },
    // {
    //   background: '#aea8e1',
    //   border: '#2b2367'
    // },
    // {
    //   background: '#a8e1cb',
    //   border: '#23674d'
    // },
    // {
    //   background: '#a8bee1',
    //   border: '#233d67'
    // }
  };

  return colorMapping[str] || colorMapping.basic;
}

function getTimelineEvents(events: AugmentedEvent[]) {
  const items: any[] = [];

  _.forEach(events, ({ datation, id, actor, label, group, kind }) => {
    // if has dates
    if (datation && datation.length > 0) {
      const kebabKind = _.kebabCase(kind);
      const colors = getStyles(kebabKind);
      const item = {
        id,
        title: he.unescape(actor.label),
        label: he.unescape(label),
        popover: 'true',
        ...resolveDatation(datation),
        className: classnames(kebabKind, 'timeline-event'),
        style: `border:1px solid ${colors.border};
          background-color: ${colors.background}`,
        group
      };

      items.push(item);
    }
  });

  // console.log(items);

  return items;
}

var options = {
  max: '2000-01-01', //Maximum date of timeline
  min: '1700-01-01', // Minimum date of timeline,
  multiselect: false, // Allow to select multiples items
  selectable: false,
  stack: true, // Stack items
  showTooltips: false,
  width: '100%',
  height: '350px',
  margin: {
    item: {
      horizontal: 5, // distance
      vertical: 1
    }
  },
  dataAttributes: [
    // attributes of html balise div
    'id',
    'start',
    'end',
    'group',
    'title',
    'label',
    'popover'
  ],
  verticalScroll: true,
  horizontalScroll: true
};

export const Timeline: React.FC = function() {
  const {
    groups,
    highlights,
    setHighlights,
    augmentedEvents,
    selected,
    select,
    setGroup,
    group
  } = useContext(SiprojurisContext);
  const $tl = useRef<HTMLDivElement>(null);

  const $events = useRef<HTMLCollectionOf<HTMLDivElement> | null>(null);

  const {
    current: { tlItems, tlGroups }
  } = useRef({
    tlItems: new vis.DataSet(),
    tlGroups: new vis.DataSet()
  });

  const toTlGroups = useMemo(
    () => _.map(groups.items, ({ id, label }) => ({ id, content: label })),
    [groups]
  );
  const toTlItems = useMemo(() => getTimelineEvents(augmentedEvents), [
    augmentedEvents
  ]);

  const { current: trigger } = useRef({
    click: (_e: any) => {},
    changed: (_e: any) => {
      console.log('changed');
    },
    mouseOver: (_e: any) => {}
  });

  useEffect(() => {
    const change = () => {
      if ($events.current && selected) {
        _.forEach($events.current, $event => {
          const currentGroup = $event.dataset.group;
          const isDimmed = $event.classList.contains('o-50');
          if (groups.kind !== selected.kind) {
            if (isDimmed) {
              console.log('timeline:opacity:remove');

              $event.classList.remove('o-50');
            }
          } else {
            if (isDimmed) {
              if (currentGroup === '' + selected.id) {
                $event.classList.remove('o-50');
                console.log('timeline:opacity:remove');
              }
            } else {
              if (currentGroup !== '' + selected.id) {
                $event.classList.add('o-50');
                console.log('timeline:opacity:add');
              }
            }
          }
        });
      }
    };
    change();

    trigger.changed = change;
    // if (selected === undefined) {
    //   _.forEach($events.current, $event => {
    //     if ($event.classList.contains('o-50')) {
    //       $event.classList.remove('o-50');
    //       console.log('remove-dim');
    //     }
    //   });
    // }

    // eslint-disable-next-line
  }, [selected, groups]);

  // on create :)
  useEffect(() => {
    const $tlCopy = $tl.current!;
    // put timeline logic here
    const timeline = new vis.Timeline($tlCopy, tlItems, tlGroups);
    timeline.setOptions(options);

    timeline.on('changed', e => trigger.changed(e));

    timeline.on('click', e => trigger.click(e));

    timeline.on('mouseOver', e => trigger.mouseOver(e));

    $($tlCopy).popover({
      selector: '[data-popover="true"]',
      trigger: 'hover',
      placement: 'top',
      content: function() {
        return this.getAttribute('data-label') || '';
      }
    });

    $events.current = $tlCopy.getElementsByClassName('timeline-event') as any;

    return () => {
      // $($tl.current!).popover('disable');
      timeline.destroy();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    trigger.click = e => {
      console.log(e);

      if (e.what !== 'background') {
        select(e.group);
      }
    };
    // eslint-disable-next-line
  }, [select]);

  useEffect(() => {
    trigger.mouseOver = (e: VisEvent) => {
      if (e.item === null && highlights.length > 0) {
        setHighlights([]);
      } else if (e.item && !_.find(highlights, ['id', e.item])) {
        setHighlights([{ id: e.item, kind: 'Event' }]);
      }
    };
    // eslint-disable-next-line
  }, [highlights]);

  useEffect(() => {
    tlGroups.clear();
    tlGroups.update(toTlGroups);
    tlItems.update(toTlItems);
    // eslint-disable-next-line
  }, [toTlItems, toTlGroups]);

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
                style={{ width: '100%' }}
              >
                <button
                  type="button"
                  className="btn btn-secondary btn-sm text-wrap"
                  name="display"
                  value="group_none"
                >
                  Dégrouper
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm text-wrap"
                  name="display"
                  value="group_person"
                  onClick={() => setGroup(group.actor)}
                >
                  Grouper par personnes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm text-wrap"
                  name="display"
                  value="group_place"
                  onClick={() => setGroup(group.localisation)}
                >
                  Grouper par lieux
                </button>
              </form>
              <a
                className="badge badge-secondary mt-1 text-white"
                id="group_filter"
                style={{ width: '100%' }}
              >
                Choisissez les groupes en cliquant dessus
              </a>
              <div
                id="start-date"
                className="text-left"
                style={{ fontSize: '9px' }}
              >
                <br />
                <span className="align-bottom"></span>
              </div>
            </div>
            <div className="col-6 border-right border-left p-0">
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
                    Evènement
                  </a>
                </li>
                <li className="badge nav-item p-0">
                  <a
                    className="nav-link text-secondary"
                    id="search-tab"
                    data-toggle="tab"
                    href="#search"
                    role="tab"
                    aria-controls="search"
                    aria-selected="false"
                  >
                    Recherche
                  </a>
                </li>
                <li
                  className="badge nav-item p-0 position-absolute"
                  style={{ right: '0px' }}
                >
                  <a
                    className="nav-link text-secondary"
                    id="nb-item-select"
                    data-disabled="disabled"
                  ></a>
                </li>
              </ul>
              <div className="tab-content" style={{ height: '60px' }}>
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
                              <div
                                className="vis-item-content"
                                style={{ width: '60px' }}
                              >
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
                            <div
                              className="vis-item-content"
                              style={{ width: 'inherit' }}
                            >
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
                              <div
                                className="vis-item-content"
                                style={{ width: '60px' }}
                              >
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
                            style={{ width: '60px' }}
                          >
                            <div className="vis-item-overflow">
                              <div
                                className="vis-item-content"
                                style={{ width: '60px' }}
                              >
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
                            style={{ width: '60px' }}
                          >
                            <div className="vis-item-overflow">
                              <div
                                className="vis-item-content"
                                style={{ width: '60px' }}
                              >
                                <div className="click-content"></div>
                              </div>
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
                            style={{ width: '60px' }}
                          >
                            <div className="vis-item-overflow">
                              <div
                                className="vis-item-content"
                                style={{ width: '60px' }}
                              >
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
                  style={{ height: '60px' }}
                >
                  <div
                    className="container-fluid text-left"
                    id="event_filter"
                  ></div>
                </div>
                <div
                  className="tab-pane fade p-1"
                  id="search"
                  role="tabpanel"
                  aria-labelledby="search-tab"
                  style={{ height: '60px' }}
                >
                  <div className="form-row">
                    <div className="col-4">
                      <input
                        className="form-control form-control-sm autocomplete mr-sm-2"
                        id="search-value"
                        type="text"
                        placeholder="Sélectionner..."
                        aria-label="Select in..."
                      />
                    </div>
                    <div className="col-8 text-left">
                      <div
                        id="unselect-search"
                        className="btn btn-sm btn-outline-danger my-2 my-sm-0 search-button"
                        data-value="unselect"
                      >
                        Déselectionner
                      </div>
                      <div
                        id="select-search"
                        className="btn btn-sm btn-outline-success my-2 my-sm-0 search-button"
                        data-value="select"
                      >
                        Selectionner
                      </div>
                      <div
                        id="select-range"
                        className="btn btn-sm btn-outline-secondary my-2 my-sm-0 search-button float-right"
                        data-value="2"
                      >
                        Selectionner dans intervale
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-3 border-0 p-1">
              <form
                name="item_selection"
                className="btn-group"
                role="group"
                aria-label="Actions on selected items"
                style={{ width: '100%' }}
              >
                <button
                  id="remove_items"
                  type="button"
                  className="btn btn-danger btn-sm text-wrap"
                  name="selection"
                  value="selection_remove"
                >
                  Supprimer les items sélectionnés
                </button>
                <button
                  id="keep_items"
                  type="button"
                  className="btn btn-success btn-sm text-wrap"
                  name="selection"
                  value="selection_keep"
                >
                  Conserver uniquement les items sélectionnés
                </button>
              </form>
              <a
                className="badge badge-secondary mt-1 text-white"
                id="reset_items"
                style={{ width: '100%', cursor: 'pointer' }}
              >
                Réinitialiser tous
              </a>
              <div
                id="end-date"
                className="text-right"
                style={{ fontSize: '9px' }}
              >
                <br />
                <span className="align-bottom"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="timewindows">
        <div className="progress" style={{ height: '5px' }}>
          <div
            className="progress-bar bg-light"
            role="progressbar"
            style={{ width: '0%' }}
            aria-valuenow={15}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
          <div
            className="progress-bar bg-secondary"
            role="progressbar"
            style={{ width: '100%' }}
            aria-valuenow={30}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
          <div
            className="progress-bar bg-light"
            role="progressbar"
            style={{ width: '0%' }}
            aria-valuenow={20}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
      <div id="timeline" ref={$tl}></div>
    </>
  );
};
