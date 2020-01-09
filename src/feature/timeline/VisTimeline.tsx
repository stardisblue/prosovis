import React, { useEffect, useContext, useRef, useMemo, useState } from 'react';
import classnames from 'classnames';
import { SiprojurisContext } from '../../context/SiprojurisContext';
import _ from 'lodash';
import { AnyEvent, Nullable, PrimaryKey, Datation } from '../../data';
import he from 'he';
import './VisTimeline.css';
import vis from 'vis-timeline';
import { GroupedEvent } from './useGroups';
import { useMouse } from './useMouse';
import { TimelineContext } from './TimelineContext';
import * as d3 from 'd3';
import moment, { Moment } from 'moment';
import { useReferences } from './useReferences';

type VisEventProps = {
  event: MouseEvent | PointerEvent;
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

type VisEventGroup = VisEventProps & {
  what: 'group-label';
  group: PrimaryKey;
};
type VisEventItem = VisEventProps & {
  what: 'item';
  item: PrimaryKey;
  group: PrimaryKey;
};
type VisEventBackground = VisEventProps & {
  what: 'background';
  item: null;
  group: PrimaryKey;
};
type VisTimeMarker = {
  id: string;
  time: Date;
  event: MouseEvent | PointerEvent;
};

type VisEvent = VisEventGroup | VisEventItem | VisEventBackground;

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

export function getStyles(str: string) {
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

function newLineLongString(str: string, maxLenght = 20): string {
  if (str.length < maxLenght) {
    return str;
  }
  const parts = _.split(str, ' ');
  const half = Math.floor((parts.length + 1) / 2);

  return _(parts)
    .chunk(half)
    .map(i => _.join(i, ' '))
    .join('<br/>');
}

function getTimelineEvents(events: GroupedEvent[]) {
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
        group,
        kind
      };

      items.push(item);
    }
  });

  return items;
}

const ctxOptions = {
  width: '100%',
  height: 70,
  margin: {
    top: 0,
    right: 20,
    bottom: 0,
    left: 20
  },
  window: {
    left: 20,
    right: 18,
    top: 15,
    bottom: 15
  },

  filter: {
    left: 20,
    right: 18,
    top: 0,
    bottom: 0
  }
};

const OPACITY_CLASS = 'o-50';

export const VisTimeline: React.FC = function() {
  const firstEventSet = useRef(true);

  const {
    highlights,
    setHighlights,
    selected,
    select,
    filteredEvents,
    setFilter
  } = useContext(SiprojurisContext);

  const { grouping, displayTypes } = useContext(TimelineContext);

  const [width, setWidth] = useState<number>();

  const timelineEvents = useMemo(() => {
    return getTimelineEvents(
      _(filteredEvents)
        .map(
          (a): GroupedEvent => ({
            ...a,
            group: grouping.groupBy(a)
          })
        )
        .value()
    );
  }, [filteredEvents, grouping]);

  const {
    $events,
    axis,
    axisRef,
    contextFilter,
    contextFilterRef,
    timeline,
    timelineRef,
    window,
    windowRef,
    x
  } = useReferences(timelineEvents);

  /*
   * CONTEXT
   */
  useEffect(() => {
    if (!timeline || !contextFilter) return;

    // contextFilter.selection.call(contextFilter.brush);

    const updateFilter = _.throttle((start: Date, end: Date) => {
      setFilter('interval', (e: any) =>
        _.some(e.datation, datation => {
          return moment(datation.clean_date).isBetween(start, end);
        })
      );
    }, 100);

    const contextThrottle = _.throttle((start: Date, end: Date) => {
      timeline.vis.setCustomTime(start, 'a');
      timeline.vis.setCustomTime(end, 'b');
      updateFilter(start, end);
    }, 16);

    const timelineThrottle = _.throttle((e: VisTimeMarker) => {
      const interval = _.sortBy([
        e.time,
        e.id === 'a'
          ? timeline.vis.getCustomTime('b')
          : timeline.vis.getCustomTime('a')
      ]);
      contextFilter.selection.call(contextFilter.brush.move, interval.map(x));
      updateFilter(interval[0], interval[1]);
    }, 16);

    contextFilter.brush.on('brush', function() {
      if (d3.event.sourceEvent) {
        const [start, end] = d3.event.selection.map(x.invert);
        contextThrottle(start, end);
      }
    });

    timeline.vis.on('timechange', (e: VisTimeMarker) => {
      timelineThrottle(e);
    });
  }, [contextFilter, timeline, setFilter, x.invert]);

  useEffect(() => {
    if (!axis || !contextFilter || !window || !width) return;

    // contextFilter.brush.brushSelection;

    x.range([ctxOptions.margin.left, width - ctxOptions.margin.right]);

    contextFilter.brush.extent([
      [ctxOptions.filter.left, ctxOptions.filter.top],
      [
        width - ctxOptions.filter.right,
        ctxOptions.height - ctxOptions.filter.bottom
      ]
    ]);

    window.brush.extent([
      [ctxOptions.window.left, ctxOptions.window.top],
      [
        width - ctxOptions.window.right,
        ctxOptions.height - ctxOptions.window.bottom
      ]
    ]);

    axis.selection.call(axis.d3Axis);

    contextFilter.selection.call(contextFilter.brush);

    window.selection.call(window.brush);

  }, [axis, contextFilter, width, window, x]);

  /*
   * Window
   */

  // Allows the window to be teleported when clicking on the context
  useEffect(() => {
    if (!window) return;
    window.selection.call(function(g) {
      g.select('.overlay')
        .datum({ type: 'selection' })
        .on('mousedown touchstart', function(this: any) {
          const brushSelection = d3.brushSelection(window.dom) as
            | [number, number]
            | null;

          if (!brushSelection) return;

          const [start, end] = brushSelection;

          const dx = end - start;
          const [cx] = d3.mouse(this);

          const [x0, x1] = [cx - dx / 2, cx + dx / 2];
          const [X0, X1] = x.range();

          d3.select(this.parentNode).call(
            window.brush.move,
            x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
          );
        });
    });
  }, [window, x]);

  // Syncs the context window view and the timeline view
  useEffect(() => {
    if (!timeline || !window) return;

    const updateWindow = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(x.invert);
      timeline.vis.setWindow(start, end, {
        animation: false
      });
    }, 16);

    const updateContext = _.throttle((interval: vis.TimelineWindow) => {
      return window.selection.call(
        window.brush.move,
        [interval.start, interval.end].map(x)
      );
    }, 16);

    window.brush.on('brush', function() {
      if (d3.event.sourceEvent && d3.event.selection) {
        updateWindow(d3.event.selection);
      }
    });

    timeline.vis.on('rangechange', (e: any) => {
      if (e.byUser) {
        updateContext(e);
      }
    });
  }, [timeline, window, x]);

  /*
   * Display Types
   */
  useEffect(() => {
    setFilter('display', (e: AnyEvent) => displayTypes[e.kind]);
  }, [displayTypes, setFilter]);

  const actions = useRef<{
    click: (e: VisEvent) => void;
    changed: (e: VisEvent) => void;
    mouseOver: (e: VisEvent) => void;
    __click: (e: VisEvent) => void;
    __drag: (e: VisEvent) => void;
  }>({
    click: (_e: VisEvent) => {},
    changed: (_e: VisEvent) => {},
    mouseOver: (_e: VisEvent) => {},
    /** @deprecated */
    __click: (_e: VisEvent) => {},
    /** @deprecated */
    __drag: (_e: VisEvent) => {}
  });

  /*
   * Binds actions and mouse interactions to the timeline
   */
  {
    // mouse actions
    const mouse = useMouse();

    useEffect(() => {
      if (!timeline) return;

      timeline.vis.on('changed', (e: any) => actions.current.changed(e));
      timeline.vis.on('click', (e: any) => actions.current.__click(e));
      timeline.vis.on('dragover', (e: any) => actions.current.__drag(e));

      timeline.vis.on('mouseDown', (e: any) => {
        if (!mouse.current.click) {
          mouse.current.click = true;
          mouse.current.x = e.pageX;
          mouse.current.y = e.pageY;
        }
      });

      timeline.vis.on('mouseMove', (e: any) => {
        if (
          mouse.current.click &&
          mouse.current.draggingTreshold(mouse.current, e.event as any)
        ) {
          mouse.current.dragging = true;
          mouse.current.click = false;
        }
      });

      timeline.vis.on('mouseUp', (e: any) => {
        if (mouse.current.click) actions.current.click(e);
        mouse.current.dragging = false;
        mouse.current.click = false;
      });

      timeline.vis.on('mouseOver', (e: any) => actions.current.mouseOver(e));

      return () => timeline.vis.destroy();
    }, [timeline, mouse]);
  }

  /*
   * Selection
   */
  // updates visual cues on timeline during navigation
  useEffect(() => {
    const change = function() {
      if (timeline) {
        const boundingRect = timeline.dom.getBoundingClientRect();
        if (width !== boundingRect.width) {
          setWidth(boundingRect.width);
        }
      }
      if ($events.current) {
        _.forEach($events.current, $event => {
          const isDimmed = $event.classList.contains(OPACITY_CLASS);

          if (selected === undefined) {
            if (isDimmed) {
              console.debug('timeline:opacity:undefined');
              $event.classList.remove(OPACITY_CLASS);
            }
          } else {
            const inSelection =
              _.sortedIndexOf(selected, +$event.dataset.id!) !== -1;
            if (isDimmed && inSelection) {
              console.debug('timeline:opacity:remove');
              $event.classList.remove(OPACITY_CLASS);
            } else if (!isDimmed && !inSelection) {
              console.debug('timeline:opacity:add');
              $event.classList.add(OPACITY_CLASS);
            }
          }
        });
      }
    };
    change();

    actions.current.changed = change;
  }, [$events, selected, timeline, width]);

  // binds click to selection actions
  useEffect(() => {
    actions.current.click = (e: VisEvent) => {
      if (e.what === 'group-label') {
        console.debug('selection:group', e.group);
        const groupEvents = _(timelineEvents)
          .filter({ group: e.group })
          .map('id')
          .sort()
          .value();
        if (e.event.ctrlKey || e.event.metaKey) {
          select(_.concat(selected || [], groupEvents));
        } else {
          select(groupEvents);
        }
      } else if (e.what === 'item') {
        const index = _.sortedIndexOf(selected, e.item);

        if (e.event.ctrlKey || e.event.metaKey) {
          if (index < 0) {
            console.debug('selection:item', e.item);
            // is not selected
            select(_.concat(selected || [], e.item));
          } else {
            console.debug('selection:item:unselect', e.item);
            const filtered = _.filter(selected, i => i !== e.item);
            select(filtered.length === 0 ? undefined : filtered);
          }
        } else {
          select([e.item]);
        }
      } else {
        if (!e.event.ctrlKey || e.event.metaKey) {
          console.debug('selection:reset');
          select();
        }
      }
    };
  }, [select, selected, timelineEvents]);

  /*
   * Highlights
   Events and Groups are highlighted
   */
  useEffect(() => {
    actions.current.mouseOver = (e: VisEvent) => {
      if (e.what === 'group-label') {
        setHighlights([{ id: e.group, kind: grouping.kind }]);
      } else if (e.what === 'item') {
        setHighlights([{ id: e.item, kind: 'Event' }]);
      } else if (highlights) {
        setHighlights();
      }
    };
  }, [highlights, setHighlights, grouping.kind]);

  /*
   * Data change
   */
  useEffect(() => {
    if (!timeline || !window || !width || !contextFilter) return;

    timeline.vis.setItems(timelineEvents);

    if (firstEventSet.current) {
      timeline.vis.fit({ animation: false });
      const interval = timeline.vis.getWindow();

      window.selection.call(
        window.brush.move,
        [interval.start, interval.end].map(x)
      );
      contextFilter.selection.call(contextFilter.brush.move, [
        ctxOptions.filter.left,
        width - ctxOptions.filter.right
      ]);

      firstEventSet.current = false;
    }
    // visTimeline.current!.redraw();
  }, [timeline, timelineEvents, x, window, contextFilter, width]);

  useEffect(() => {
    if (!timeline) return;

    // Set Groups
    timeline.vis.setGroups(
      _.map(grouping.groups(filteredEvents), ({ id, label }) => ({
        id,
        content: newLineLongString(label)
      }))
    );
    // visTimeline.current!.redraw();
  }, [filteredEvents, grouping, timeline]);

  return (
    <>
      <div id="timeline" ref={timelineRef}></div>
      <svg
        id="timeline-context"
        // ref={contextRef}
        width="100%"
        height={ctxOptions.height + 'px'}
      >
        <g
          id="context-axis"
          className="axis"
          ref={axisRef}
          transform={`translate(0, ${ctxOptions.height - 35})`}
        ></g>
        <g id="context-filter" className="brush" ref={contextFilterRef}></g>
        <g id="context-window" className="brush" ref={windowRef}></g>
      </svg>
    </>
  );
};
