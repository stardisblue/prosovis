import React, { useEffect, useRef, useState, useMemo } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Nullable, PrimaryKey, Datation } from '../../data';
import he from 'he';
import './VisTimeline.css';
import { useMouse } from './useMouse';
import * as d3 from 'd3';
import moment, { Moment } from 'moment';
import { useReferences } from './useReferences';
import { useSelector, useDispatch } from 'react-redux';
import { clearHighlights, setHighlights } from '../../reducers/highlightSlice';
import {
  addSelection,
  setSelection,
  clearSelection
} from '../../reducers/selectionSlice';
import { setIntervalMask } from '../../reducers/maskSlice';
import { selectMaskedEvents } from '../../selectors/mask';
import { selectHighlights } from '../../selectors/highlight';
import { selectionAsMap } from '../../selectors/selection';
import { selectMainColor, selectBorderColor } from '../../selectors/color';
import { createSelector } from '@reduxjs/toolkit';
import {
  selectTimelineGroupBy,
  selectTimelineGroup,
  selectTimelineEventGroups
} from './timelineGroupSlice';
import { StackedChart } from './StackedChart';
import { ContextTimeAxis } from './ContextTimeAxis';
import { ContextWindowBrush } from './ContextWindowBrush';

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

const margins = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 20
};

const windowMargins = {
  left: 20,
  right: 18,
  top: 15,
  bottom: 15
};

const filterMargins = {
  left: 20,
  right: 18,
  top: 0,
  bottom: 0
};

const dimensions = {
  width: '100%',
  height: 70
};

const OPACITY_CLASS = 'o-50';

const selectTimelineEvents = createSelector(
  selectMaskedEvents,
  selectTimelineGroupBy,
  selectMainColor,
  selectBorderColor,
  (events, groupBy, mainColor, borderColor) => {
    return _.transform(
      events,
      function(acc, e) {
        if (e.datation && e.datation.length > 0) {
          const { id, actor, label, kind, datation } = e;
          acc.push({
            id,
            title: he.unescape(actor.label),
            label: he.unescape(label),
            popover: 'true',
            ...resolveDatation(datation),
            className: classnames(_.kebabCase(kind), 'timeline-event'),
            style: `border:1px solid ${borderColor(kind)};
            background-color: ${mainColor(kind)}`,
            group: groupBy(e),
            kind
          });
        }
      },
      [] as any[]
    );
  }
);

const options = {
  max: '2000-01-01', //Maximum date of timeline
  min: '1700-01-01' // Minimum date of timeline,
};

export const VisTimeline: React.FC = function() {
  const color = useSelector(selectMainColor);
  const filteredEvents = useSelector(selectMaskedEvents);

  const dispatch = useDispatch();

  const highlights = useSelector(selectHighlights);
  const selection = useSelector(selectionAsMap);
  const groups = useSelector(selectTimelineEventGroups);
  const groupingKind = useSelector(selectTimelineGroup);

  const [width, setWidth] = useState<number>();

  const x = useMemo(
    () =>
      width !== undefined
        ? d3
            .scaleTime()
            .domain([moment(options.min), moment(options.max)])
            .range([margins.left, width - margins.right])
            .nice()
            .clamp(true)
        : undefined,
    [width]
  );

  const timelineEvents = useSelector(selectTimelineEvents);

  const {
    $events,
    contextFilter,
    contextFilterRef,
    timeline,
    timelineRef
  } = useReferences();

  /*
   * CONTEXT
   */
  useEffect(() => {
    if (!timeline || !contextFilter || !x) return;
    const updateFilter = _.throttle((start: Date, end: Date) => {
      dispatch(
        setIntervalMask({
          start: start.toDateString(),
          end: end.toDateString()
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
  }, [contextFilter, timeline, dispatch, x]);

  useEffect(() => {
    if (!contextFilter || !width) return;

    contextFilter.brush.extent([
      [filterMargins.left, filterMargins.top],
      [width - filterMargins.right, dimensions.height - filterMargins.bottom]
    ]);

    contextFilter.selection.call(contextFilter.brush);
  }, [color, contextFilter, width]);

  const [windowSync, setWindowSync] = useState<[Date, Date]>();

  useEffect(() => {
    if (!timeline) return;

    const sync = _.throttle((start: Date, end: Date) => {
      return setWindowSync([start, end]);
    }, 16);

    timeline.vis.on('rangechange', (e: any) => {
      if (e.byUser) {
        sync(e.start, e.end);
      }
    });
  }, [timeline]);

  // Syncs the context window view and the timeline view
  const updateTimeline = useMemo(() => {
    if (!timeline) return (selection: number[]) => {};

    return _.throttle((selection: number[]) => {
      const [start, end] = selection;
      timeline.vis.setWindow(start, end, {
        animation: false
      });
    }, 16);
  }, [timeline]);

  const actions = useRef<{
    click: (e: VisEvent) => void;
    changed: (e: VisEvent) => void;
    mouseOver: (e: VisEvent) => void;
    mouseOut: (e: VisEvent) => void;
    __click: (e: VisEvent) => void;
    __drag: (e: VisEvent) => void;
  }>({
    click: (_e: VisEvent) => {},
    changed: (_e: VisEvent) => {},
    mouseOver: (_e: VisEvent) => {},
    mouseOut: (_e: VisEvent) => {},
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
    }, [dispatch, timeline, mouse]);
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

          if (_.isEmpty(selection)) {
            if (isDimmed) {
              console.debug('timeline:opacity:undefined');
              $event.classList.remove(OPACITY_CLASS);
            }
          } else {
            const inSelection = selection[+$event.dataset.id!] !== undefined;
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
  }, [$events, selection, timeline, width]);

  // binds click to selection actions
  useEffect(() => {
    actions.current.click = (e: VisEvent) => {
      if (e.what === 'group-label') {
        console.debug('selection:group', e.group);
        const groupEvents = _(timelineEvents)
          .filter({ group: e.group })
          .map(({ id }) => ({ id, kind: 'Event' }))
          .sortBy('id')
          .value();
        if (e.event.ctrlKey || e.event.metaKey) {
          dispatch(addSelection(groupEvents));
        } else {
          dispatch(setSelection(groupEvents));
        }
      } else if (e.what === 'item') {
        const index = selection[e.item];

        if (e.event.ctrlKey || e.event.metaKey) {
          if (index) {
            console.debug('selection:item:unselect', e.item);
            const filtered = _.filter(selection, i => i.id !== e.item);
            if (filtered) {
              dispatch(setSelection(filtered));
            }
          } else {
            console.debug('selection:item', e.item);
            // is not selected
            dispatch(addSelection({ id: e.item, kind: 'Event' }));
          }
        } else {
          dispatch(setSelection({ id: e.item, kind: 'Event' }));
        }
      } else {
        if (!e.event.ctrlKey || e.event.metaKey) {
          console.debug('selection:reset');
          dispatch(clearSelection());
        }
      }
    };
  }, [dispatch, selection, timelineEvents]);

  /*
   * Highlights
   Events and Groups are highlighted
   */
  useEffect(() => {
    actions.current.mouseOver = (e: VisEvent) => {
      if (e.what === 'group-label') {
        dispatch(setHighlights({ id: e.group, kind: groupingKind }));
      } else if (e.what === 'item') {
        dispatch(setHighlights({ id: e.item, kind: 'Event' }));
      } else if (highlights) {
        dispatch(clearHighlights());
      }
    };

    actions.current.mouseOut = () => {
      if (highlights) dispatch(clearHighlights());
    };
  }, [highlights, dispatch, groupingKind]);

  /*
   * Data change
   */
  const [firstEvent, setFirstEvent] = useState<boolean | number>(false);

  useEffect(() => {
    if (!timeline) return;

    timeline.vis.setItems(timelineEvents);
    if (firstEvent === false) {
      setFirstEvent(true);
    }
    // visTimeline.current!.redraw();
  }, [firstEvent, timeline, timelineEvents]);

  useEffect(() => {
    if (firstEvent !== true) return;
    if (!timeline || !width || !contextFilter || !x) return;

    timeline.vis.fit({ animation: false });
    const interval = timeline.vis.getWindow();

    setWindowSync([interval.start, interval.end]);
    contextFilter.selection.call(contextFilter.brush.move, [
      filterMargins.left,
      width - filterMargins.right
    ]);

    setFirstEvent(width);
  }, [contextFilter, firstEvent, timeline, width, x]);

  useEffect(() => {
    if (!timeline) return;

    // Set Groups
    timeline.vis.setGroups(
      _.map(groups, ({ id, label }) => ({
        id,
        content: newLineLongString(label)
      }))
    );
    // visTimeline.current!.redraw();
  }, [filteredEvents, groups, timeline]);

  return (
    <>
      <div id="timeline" ref={timelineRef}></div>
      <svg
        id="timeline-context"
        // ref={contextRef}
        width="100%"
        height={dimensions.height + 'px'}
      >
        {x && (
          <>
            <ContextTimeAxis dimensions={dimensions} margins={margins} x={x} />
            <StackedChart dimensions={dimensions} margins={margins} x={x} />
            <FilterBrush ref={contextFilterRef} />
            {width && (
              <ContextWindowBrush
                onBrush={updateTimeline}
                width={width}
                windowSync={windowSync}
                x={x}
                margins={windowMargins}
                dimensions={dimensions}
              />
            )}
          </>
        )}
      </svg>
    </>
  );
};

export const FilterBrush = React.forwardRef<SVGGElement>(function(_props, ref) {
  return <g id="context-filter" className="brush" ref={ref}></g>;
});
