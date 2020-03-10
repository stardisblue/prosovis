import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Nullable, PrimaryKey, Datation } from '../../data';
import he from 'he';
import './VisTimeline.css';
import { useMouse } from './useMouse';
import { Moment } from 'moment';
import { useReferences } from './useReferences';
import { useSelector, useDispatch } from 'react-redux';
import { clearHighlights, setHighlights } from '../../reducers/highlightSlice';
import {
  addSelection,
  setSelection,
  clearSelection
} from '../../reducers/selectionSlice';
import { selectMaskedEvents } from '../../selectors/mask';
import { selectHighlights } from '../../selectors/highlight';
import { selectEventColor } from '../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import {
  selectTimelineGroupBy,
  selectTimelineGroup,
  selectTimelineEventGroups
} from './timelineGroupSlice';
import { Context } from './Context';
import { superSelectionAsMap } from '../../selectors/superHighlights';

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

const OPACITY_CLASS = 'o-50';

const selectTimelineEvents = createSelector(
  selectMaskedEvents,
  selectTimelineGroupBy,
  selectEventColor,
  (events, groupBy, eventColor) => {
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
            style: `border:1px solid ${eventColor.border(e)};
            background-color: ${eventColor.main(e)}`,
            group: groupBy(e),
            kind
          });
        }
      },
      [] as any[]
    );
  }
);

export const VisTimeline: React.FC = function() {
  const dispatch = useDispatch();

  const groups = useSelector(selectTimelineEventGroups);

  const [width, setWidth] = useState<number>();

  const timelineEvents = useSelector(selectTimelineEvents);

  const { $events, timeline, timelineRef } = useReferences();

  /*
   * CONTEXT
   */
  const updateMarkers = useMemo(
    function() {
      if (!timeline) return () => {};
      return _.throttle((start: Date, end: Date) => {
        timeline.vis.setCustomTime(start, 'a');
        timeline.vis.setCustomTime(end, 'b');
      }, 16);
    },
    [timeline]
  );

  const updateView = useMemo(() => {
    if (!timeline) return () => {};

    return _.throttle((start: Date, end: Date) => {
      timeline.vis.setWindow(start, end, {
        animation: false
      });
    }, 16);
  }, [timeline]);

  const [maskSync, setMaskSync] = useState<[Date, Date]>();
  const [viewSync, setViewSync] = useState<[Date, Date]>();

  useEffect(() => {
    if (!timeline) return;

    // view sync with context
    const viewSyncThrottle = _.throttle(function(start: Date, end: Date) {
      setViewSync([start, end]);
    }, 16);

    // mask sync with context
    const maskSyncThrottle = _.throttle(function(e: VisTimeMarker) {
      const interval = _.sortBy([
        e.time,
        e.id === 'a'
          ? timeline.vis.getCustomTime('b')
          : timeline.vis.getCustomTime('a')
      ]) as [Date, Date];
      setMaskSync(interval);
    }, 16);

    timeline.vis.on('rangechange', (e: any) => {
      if (e.byUser) {
        viewSyncThrottle(e.start, e.end);
      }
    });

    timeline.vis.on('timechange', (e: VisTimeMarker) => {
      maskSyncThrottle(e);
    });
  }, [timeline]);

  // Syncs the context window view and the timeline view

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
  const selection = useSelector(superSelectionAsMap);

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
            const inSelection = selection[$event.dataset.id!] !== undefined;
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

  actions.current.click = useCallback(
    (e: VisEvent) => {
      switch (e.what) {
        case 'group-label':
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
          break;
        case 'item':
          if (e.event.ctrlKey || e.event.metaKey) {
            if (selection[e.item]) {
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
          break;
        default:
          if (!e.event.ctrlKey && !e.event.metaKey) {
            console.debug('selection:reset');
            dispatch(clearSelection());
          }
      }
    },
    [dispatch, selection, timelineEvents]
  );

  /*
   * Highlights
   Events and Groups are highlighted
   */
  const highlights = useSelector(selectHighlights);
  const groupingKind = useSelector(selectTimelineGroup);

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
    if (!timeline || !width) return;

    timeline.vis.fit({ animation: false });
    const interval = timeline.vis.getWindow();

    setViewSync([interval.start, interval.end]);

    setFirstEvent(width);
  }, [firstEvent, timeline, width]);

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
  }, [groups, timeline]);

  return (
    <>
      <div id="timeline" ref={timelineRef}></div>
      {width && (
        <Context
          mask={maskSync}
          onMaskUpdate={updateMarkers}
          view={viewSync}
          onViewUpdate={updateView}
          width={width}
        />
      )}
    </>
  );
};
