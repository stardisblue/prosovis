import React, {
  useEffect,
  useContext,
  useRef,
  useMemo,
  useState,
  useCallback
} from 'react';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import classnames from 'classnames';
import { SiprojurisContext } from '../SiprojurisContext';
import _ from 'lodash';
import { AnyEvent, Nullable, PrimaryKey, Datation } from '../models';
import { Moment } from 'moment';
import he from 'he';
import './VisTimeline.css';
import vis from 'vis';
import { GroupedEvent } from '../hooks/useGroups';
import { useMouse } from '../hooks/useMouse';
import { SiprojurisTimelineContext } from './SiprojurisTimeline';
import * as d3 from 'd3';
import moment from 'moment';

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
        ...resolveDatation(_.sortBy(datation, 'clean_date')),
        className: classnames(kebabKind, 'timeline-event'),
        style: `border:1px solid ${colors.border};
            background-color: ${colors.background}`,
        group,
        kind
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
  orientation: { item: 'top' },
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

const ctxOptions = {
  width: '100%',
  height: 50,
  margin: {
    top: 0,
    right: 10,
    bottom: 20,
    left: 10
  }
};

const OPACITY_CLASS = 'o-50';

export const VisTimeline: React.FC = function() {
  const {
    highlights,
    setHighlights,
    selected,
    select,
    filteredEvents,
    setFilter
  } = useContext(SiprojurisContext);
  const { grouping, displayTypes } = useContext(SiprojurisTimelineContext);

  const $timelineRef = useRef<HTMLDivElement>(null);
  const visTimeline = useRef<vis.Timeline>();

  const $eventsRef = useRef<HTMLCollectionOf<HTMLDivElement> | null>(null);

  const [width, setWidth] = useState(0);
  const d3Ref = useRef<any>(null);

  useEffect(() => {
    setFilter(() => (e: AnyEvent) => displayTypes[e.kind]);
  }, [displayTypes, setFilter]);

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

  const mouse = useMouse();

  const clickRef = useRef((_e: VisEvent) => {});
  const changedRef = useRef((e: VisEvent) => {
    console.log('changed', e);
  });
  const mouseOverRef = useRef((_e: VisEvent) => {});

  const triggerRef = useRef({
    /** @deprecated */
    legacyClick: (e_: VisEvent) => {},
    /** @deprecated */
    legacyDrag: (_e: VisEvent) => {
      console.log('legacyDrag');
    }
  });

  const updateTimelineWindow = useCallback(
    _.throttle(
      (interval: vis.TimelineWindow) =>
        d3Ref.current.window.call(
          d3Ref.current.brush.move,
          [interval.start, interval.end].map(d3Ref.current.xScale)
        ),
      10
    ),
    []
  );

  // on create :)
  useEffect(() => {
    const $timeline = $timelineRef.current!;
    // put timeline logic here
    const timeline = new vis.Timeline($timeline, [], []);
    timeline.setOptions(options);

    timeline.on('changed', (e: any) => changedRef.current(e));
    timeline.on('click', (e: any) => triggerRef.current.legacyClick(e));
    timeline.on('dragover', (e: any) => triggerRef.current.legacyDrag(e));

    timeline.on('mouseDown', (e: any) => {
      if (!mouse.click) {
        mouse.click = true;
        mouse.x = e.pageX;
        mouse.y = e.pageY;
      }
    });

    timeline.on('mouseMove', (e: any) => {
      if (mouse.click && mouse.draggingTreshold(mouse, e.event as any)) {
        mouse.dragging = true;
        mouse.click = false;
      }
    });

    timeline.on('mouseUp', (e: any) => {
      if (mouse.click) clickRef.current(e);

      mouse.dragging = false;
      mouse.click = false;
    });

    timeline.on('mouseOver', (e: any) => mouseOverRef.current(e));

    timeline.on('rangechange', event => {
      if (d3Ref.current && event.byUser) {
        // const xScale = d3Ref.current.xScale;
        // console.log(window, xScale(event.start), xScale(event.end));

        updateTimelineWindow(event);
      }
    });

    $($timeline).popover({
      selector: '[data-popover="true"]',
      trigger: 'hover',
      placement: 'top',
      content: function() {
        return this.getAttribute('data-label') || '';
      }
    });

    $eventsRef.current = $timeline.getElementsByClassName(
      'timeline-event'
    ) as any;

    visTimeline.current = timeline;

    return () => {
      timeline.destroy();
    };
    //eslint-disable-next-line
  }, []);

  const $svgWindow = useRef<SVGGElement>(null);

  useEffect(() => {
    const change = function() {
      if ($timelineRef.current) {
        const boundingClientRect = $timelineRef.current.getBoundingClientRect();
        if (width !== boundingClientRect.width) {
          setWidth(boundingClientRect.width);
        }
      }
      if ($eventsRef.current) {
        _.forEach($eventsRef.current, $event => {
          const isDimmed = $event.classList.contains(OPACITY_CLASS);

          if (selected === undefined) {
            if (isDimmed) {
              console.log('timeline:opacity:undefined');
              $event.classList.remove(OPACITY_CLASS);
            }
          } else {
            const inSelection =
              _.sortedIndexOf(selected, +$event.dataset.id!) !== -1;
            if (isDimmed && inSelection) {
              console.log('timeline:opacity:remove');
              $event.classList.remove(OPACITY_CLASS);
            } else if (!isDimmed && !inSelection) {
              console.log('timeline:opacity:add');
              $event.classList.add(OPACITY_CLASS);
            }
          }
        });
      }
    };
    change();

    changedRef.current = change;
  }, [selected, width]);

  useEffect(() => {
    clickRef.current = (e: VisEvent) => {
      console.log('click', e);
      if (e.what === 'group-label') {
        select(
          _(timelineEvents)
            .filter({ group: e.group })
            .map('id')
            .value()
        );
      } else if (e.what === 'item') {
        select([e.item]);
      } else {
        select();
      }
    };
  }, [select, timelineEvents]);

  useEffect(() => {
    mouseOverRef.current = (e: VisEvent) => {
      if (e.what === 'group-label') {
        setHighlights([{ id: e.group, kind: grouping.kind }]);
      } else if (e.what === 'item') {
        setHighlights([{ id: e.item, kind: 'Event' }]);
      } else if (highlights) {
        setHighlights();
      }
    };
  }, [highlights, setHighlights, grouping.kind]);

  useEffect(() => {
    visTimeline.current!.setItems(timelineEvents);
    // visTimeline.current!.redraw();
  }, [timelineEvents]);

  useEffect(() => {
    visTimeline.current!.setGroups(
      _.map(grouping.groups(filteredEvents), ({ id, label }) => ({
        id,
        content: label
      }))
    );
    visTimeline.current!.redraw();
  }, [grouping, filteredEvents]);

  const $svgTimeline = useRef<SVGSVGElement>(null);
  const $svgAxis = useRef<SVGGElement>(null);

  useEffect(() => {
    d3Ref.current = {
      timeline: d3.select($svgTimeline.current),
      xScale: d3
        .scaleTime()
        .domain([moment(options.min), moment(options.max)])
        .range([5, width - 5])
        .clamp(true),
      g_axis: d3.select($svgAxis.current)
    };

    d3Ref.current.axis = d3.axisBottom(d3Ref.current.xScale);
    // .ticks(d3.timeYear.every(10))
    // .tickFormat((x: any) => {
    //   return moment(x).year() % 20 === 0 ? d3.timeFormat('%Y')(x) : '';
    // });

    const updateWindow = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(d3Ref.current.xScale.invert);
      visTimeline.current!.setWindow(start, end, {
        animation: false
      });
    }, 10);

    d3Ref.current.brush = d3
      .brushX()
      .on('brush', function(d: any) {
        if (d3.event.sourceEvent !== null) {
          // console.log(d, d3.event);
          updateWindow(d3.event.selection);
        }
      })
      .extent([
        [ctxOptions.margin.left, ctxOptions.margin.top],
        [ctxOptions.margin.left, ctxOptions.height]
      ]);

    d3Ref.current.window = d3
      .select($svgWindow.current)
      .attr('class', 'brush')
      .call(d3Ref.current.brush);
  }, []);

  useEffect(() => {
    if ($svgAxis.current && d3Ref.current) {
      d3Ref.current.xScale.range([
        ctxOptions.margin.right,
        width - ctxOptions.margin.left
      ]);
      d3Ref.current.g_axis.call(d3Ref.current.axis);

      d3Ref.current.brush.extent([
        [ctxOptions.margin.left, ctxOptions.margin.top],
        [width - ctxOptions.margin.right, ctxOptions.height]
      ]);
      d3Ref.current.window.call(d3Ref.current.brush);

      const interval = visTimeline.current!.getWindow();

      updateTimelineWindow(interval);
    }
  }, [width]);

  return (
    <>
      <div id="timeline" ref={$timelineRef}></div>
      <svg
        id="timeline-context"
        ref={$svgTimeline}
        width="100%"
        height={ctxOptions.height + 'px'}
      >
        <g
          className="axis"
          ref={$svgAxis}
          transform={`translate(0, ${ctxOptions.height - 20})`}
        ></g>
        <g className="window" ref={$svgWindow}></g>
      </svg>
    </>
  );
};