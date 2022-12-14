import React, { useEffect, useRef, useState, useMemo } from 'react';
import './ProsoVisTimeline.css';

import classnames from 'classnames';
import {
  chunk,
  filter,
  forEach,
  identity,
  isEmpty,
  join,
  kebabCase,
  map,
  noop,
  pipe,
  sortBy,
  split,
  throttle,
  transform,
} from 'lodash/fp';
import { Nullable } from '../../v2/types/utils';
import { unescape } from 'he';
import { useMouse } from './useMouse';
import { useReferences } from './useReferences';
import { useSelector, useDispatch } from 'react-redux';
import {
  addSelection,
  setSelection,
  clearSelection,
} from '../../reducers/selectionSlice';
import { selectMaskedEvents } from '../../selectors/mask';
import { selectRichEventColor } from '../../selectors/switch';
import { createSelector } from '@reduxjs/toolkit';
import {
  selectTimelineGroupBy,
  selectTimelineGroup,
  selectTimelineEventGroups,
} from './timelineGroupSlice';
import { Context } from './Context';
import {
  superSelectionAsMap,
  selectSuperHighlight,
} from '../../selectors/superHighlights';
import {
  clearSuperHighlights,
  setSuperHighlights,
} from '../../reducers/superHighlightSlice';
import ActorPlaceSwitch from './header/ActorPlaceSwitch';
import styled from 'styled-components/macro';
import { getEventLabel } from '../../data/getEventLabel';
import { useUpdateMask } from './useUpdateMask';
import { ProsoVisDate } from '../../v2/types/events';
import { ProsoVisActor } from '../../v2/types/actors';
import { ProsoVisLocalisation } from '../../v2/types/localisations';

type VisEventProps = {
  event: MouseEvent | PointerEvent;
  item: Nullable<string>;
  group: Nullable<string>;
  what: Nullable<string>;
  pageX: number;
  pageY: number;
  x: number;
  y: number;
  time: Date;
  snappedTime: Date;
};

type VisEventGroup = VisEventProps & {
  what: 'group-label';
  group: string;
};
type VisEventItem = VisEventProps & {
  what: 'item';
  item: string;
  group: string;
};
type VisEventBackground = VisEventProps & {
  what: 'background';
  item: null;
  group: string;
};
type VisTimeMarker = {
  id: string;
  time: Date;
  event: MouseEvent | PointerEvent;
};

type VisEvent = VisEventGroup | VisEventItem | VisEventBackground;

function resolveDatation([start, end]: ProsoVisDate[]): {
  start: string;
  end: Nullable<string>;
  type: string;
} {
  return {
    start: start.value,
    end: end ? end.value : null,
    type: end ? 'range' : 'box',
  };
}

function newLineLongString(str: string, maxLenght = 30): string {
  if (str.length < maxLenght) {
    return str.padEnd(maxLenght, '\u00a0');
  }
  const parts = split(' ', str);
  const half = Math.floor((parts.length + 1) / 2);

  return pipe(
    chunk(half),
    map((i) => join(' ', i).padEnd(maxLenght, '\u00a0')),
    join('<br/>')
  )(parts);
}

const OPACITY_CLASS = 'o-50';

type TimelineEvent = {
  id: string;
  title: string;
  start: string;
  end: Nullable<string>;
  type: string;
  popover: 'true';
  className: string;
  style: string;
  group: string | 0;
  kind: string;
};

const selectTimelineEvents = createSelector(
  selectMaskedEvents,
  selectTimelineGroupBy,
  selectRichEventColor,
  (events, groupBy, eventColor) => {
    return transform(
      function (acc, richEvent) {
        const { event: e } = richEvent;
        if (e.datation && e.datation.length > 0) {
          const { id, kind, datation } = e;
          acc.push({
            id,
            title: unescape(getEventLabel(e, 'ActorNote')),
            // label: "",
            popover: 'true',
            ...resolveDatation(datation),
            className: classnames(kebabCase(kind), 'timeline-event'),
            style: `border:0 solid white;
            border-left: 1px solid white;
            border-right: 1px solid white;
            background-color: ${eventColor.main(richEvent)};`,
            group: groupBy(e),
            kind,
          });
        }
      },
      [] as TimelineEvent[],
      events
    );
  }
);

const ProsoVisTimeline: React.FC<{ className?: string }> = function ({
  className,
}) {
  const dispatch = useDispatch();

  const groups = useSelector(selectTimelineEventGroups);

  const [width, setWidth] = useState<number>();

  const timelineEvents = useSelector(selectTimelineEvents);

  const { $events, timeline, timelineRef } = useReferences();

  /*
   * CONTEXT
   */
  const updateMask = useUpdateMask();
  const [maskSync, setMaskSync] = useState<[Date, Date]>();
  const handleUpdateMask = useMemo(
    function () {
      if (!timeline) return noop;
      return throttle(16, (start: Date, end: Date) => {
        timeline.vis.setCustomTime(start, 'a');
        timeline.vis.setCustomTime(end, 'b');
        updateMask(start, end);
      });
    },
    [timeline, updateMask]
  );

  const [viewSync, setViewSync] = useState<[Date, Date]>();
  const handleUpdateView = useMemo(() => {
    if (!timeline) return noop;

    return throttle(16, (start: Date, end: Date) => {
      timeline.vis.setWindow(start, end, {
        animation: false,
      });
    });
  }, [timeline]);

  useEffect(() => {
    if (!timeline) return;

    // view sync with context
    const viewSyncThrottle = throttle(16, function (start: Date, end: Date) {
      setViewSync([start, end]);
    });

    // mask sync with context
    const maskSyncThrottle = throttle(16, function (e: VisTimeMarker) {
      const interval = sortBy(identity, [
        e.time,
        e.id === 'a'
          ? timeline.vis.getCustomTime('b')
          : timeline.vis.getCustomTime('a'),
      ]) as [Date, Date];
      setMaskSync(interval);
      const [start, end] = interval;
      updateMask(start, end);
    });

    timeline.vis.on('rangechange', (e: any) => {
      if (e.byUser) {
        viewSyncThrottle(e.start, e.end);
      }
    });

    timeline.vis.on('timechange', (e: VisTimeMarker) => {
      maskSyncThrottle(e);
    });
  }, [timeline, updateMask]);

  // Syncs the context window view and the timeline view

  const actions = useRef<{
    click: (e: VisEvent) => void;
    changed: (e: VisEvent) => void;
    mouseOver: (e: VisEvent) => void;
    mouseOut: (e: VisEvent) => void;
    // __click: (e: VisEvent) => void;
    // __drag: (e: VisEvent) => void;
  }>(undefined as any);
  if (actions.current === undefined) {
    actions.current = {
      click: (_e: VisEvent) => {},
      changed: (_e: VisEvent) => {},
      mouseOver: (_e: VisEvent) => {},
      mouseOut: (_e: VisEvent) => {},
      // __click: (_e: VisEvent) => {},
      // __drag: (_e: VisEvent) => {},
    };
  }

  /*
   * Binds actions and mouse interactions to the timeline
   */
  {
    // mouse actions
    const mouse = useMouse();

    useEffect(() => {
      if (!timeline) return;

      timeline.vis.on('changed', (e: any) => actions.current.changed(e));
      // timeline.vis.on('click', (e: any) => actions.current.__click(e));
      // timeline.vis.on('dragover', (e: any) => actions.current.__drag(e));

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
      // safely ignoring dispatch and mouse as they are references
      // eslint-disable-next-line
    }, [timeline]);
  }

  /*
   * Selection
   */
  // updates visual cues on timeline during navigation
  const selection = useSelector(superSelectionAsMap);

  useEffect(() => {
    const change = function () {
      if (timeline) {
        const boundingRect = timeline.dom.getBoundingClientRect();
        if (width !== boundingRect.width) {
          setWidth(boundingRect.width);
        }
      }
      if ($events.current) {
        forEach(($event) => {
          const isDimmed = $event.classList.contains(OPACITY_CLASS);

          if (isEmpty(selection)) {
            if (isDimmed) {
              // console.debug('timeline:opacity:undefined');
              $event.classList.remove(OPACITY_CLASS);
            }
          } else {
            const inSelection = selection[$event.dataset.id!] !== undefined;
            if (isDimmed && inSelection) {
              // console.debug('timeline:opacity:remove');
              $event.classList.remove(OPACITY_CLASS);
            } else if (!isDimmed && !inSelection) {
              // console.debug('timeline:opacity:add');
              $event.classList.add(OPACITY_CLASS);
            }
          }
        }, $events.current);
      }
    };
    change();

    actions.current.changed = change;
  }, [$events, selection, timeline, width]);

  // binds click to selection actions

  useEffect(() => {
    actions.current.click = (e: VisEvent) => {
      switch (e.what) {
        case 'group-label':
          // console.debug('selection:group', e.group);
          const groupEvents = pipe(
            filter<TimelineEvent>({ group: e.group }),
            map(({ id }) => ({ id, kind: 'Event' })),
            sortBy<{ id: string; kind: 'Event' }>('id')
          )(timelineEvents);
          // const groupEvents = _(timelineEvents)
          //   .filter({ group: e.group })
          //   .map(({ id }) => ({ id, kind: 'Event' }))
          //   .sortBy('id')
          //   .value();
          if (e.event.ctrlKey || e.event.metaKey) {
            dispatch(addSelection(groupEvents));
          } else {
            dispatch(setSelection(groupEvents));
          }
          break;
        case 'item':
          if (e.event.ctrlKey || e.event.metaKey) {
            if (selection[e.item]) {
              // console.debug('selection:item:unselect', e.item);
              const filtered = filter((i) => i.id !== e.item, selection);
              if (filtered) {
                dispatch(setSelection(filtered));
              }
            } else {
              // console.debug('selection:item', e.item);
              // is not selected
              dispatch(addSelection({ id: e.item, kind: 'Event' }));
            }
          } else {
            dispatch(setSelection({ id: e.item, kind: 'Event' }));
          }
          break;
        default:
          if (!e.event.ctrlKey && !e.event.metaKey) {
            // console.debug('selection:reset');
            dispatch(clearSelection());
          }
      }
    };
  }, [dispatch, selection, timelineEvents]);

  /*
   * Highlights
   Events and Groups are highlighted
   */
  const highlights = useSelector(selectSuperHighlight);
  const groupingKind = useSelector(selectTimelineGroup);

  useEffect(() => {
    actions.current.mouseOver = (e: VisEvent) => {
      if (e.what === 'group-label') {
        pipe(
          filter<TimelineEvent>({ group: e.group }),
          map(({ id }) => ({ id, kind: 'Event' })),
          sortBy<{ id: string; kind: 'Event' }>('id'),
          setSuperHighlights,
          dispatch
        )(timelineEvents);

        // dispatch(setSuperHighlights(groupEvents));
      } else if (e.what === 'item') {
        dispatch(setSuperHighlights({ id: e.item, kind: 'Event' }));
      } else if (highlights) {
        dispatch(clearSuperHighlights());
      }
    };

    actions.current.mouseOut = () => {
      if (highlights) dispatch(clearSuperHighlights());
    };
  }, [highlights, dispatch, groupingKind, timelineEvents]);

  /*
   * Data change
   */
  const [firstEvent, setFirstEvent] = useState<boolean | number>(false);

  useEffect(() => {
    if (!timeline) return;

    timeline.vis.setItems(timelineEvents as any[]);
    if (firstEvent === false) {
      setFirstEvent(true);
    }
    // visTimeline.current!.redraw();
  }, [firstEvent, timeline, timelineEvents]);

  useEffect(() => {
    if (firstEvent !== true) return;
    if (!timeline || !width) return;
    if (timelineEvents.length === 0) return;
    timeline.vis.fit({ animation: false });
    const interval = timeline.vis.getWindow();

    setViewSync([interval.start, interval.end]);

    setFirstEvent(width);
  }, [firstEvent, timeline, width, timelineEvents]);

  useEffect(() => {
    if (!timeline) return;

    // Set Groups
    timeline.vis.setGroups(
      map(
        ({ id, label }) => ({
          id,
          content: newLineLongString(label),
        }),
        groups as (ProsoVisActor | ProsoVisLocalisation)[]
      )
    );
    // visTimeline.current!.redraw();
  }, [groups, timeline]);

  return (
    <div className={className}>
      <div id="timeline" ref={timelineRef}>
        <VisHeader />
      </div>
      {width && (
        <Context
          mask={maskSync}
          onMaskUpdate={handleUpdateMask}
          view={viewSync}
          onViewUpdate={handleUpdateView}
          width={width}
        />
      )}
    </div>
  );
};

const VisHeader = styled(ActorPlaceSwitch)`
  position: absolute;
  bottom: 20px;
  z-index: 2;
  line-height: 1.2;
  background-color: white;
`;

export default ProsoVisTimeline;
