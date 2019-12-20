import React, { useEffect, useContext, useRef, useMemo, useState } from 'react';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import classnames from 'classnames';
import { SiprojurisContext } from '../SiprojurisContext';
import _ from 'lodash';
import { AnyEvent, Nullable, PrimaryKey, Datation } from '../models';
import he from 'he';
import './VisTimeline.css';
import vis from 'vis-timeline';
import { GroupedEvent } from '../hooks/useGroups';
import { useMouse } from '../hooks/useMouse';
import { SiprojurisTimelineContext } from './SiprojurisTimeline';
import * as d3 from 'd3';
import moment, { Moment } from 'moment';

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
  const {
    highlights,
    setHighlights,
    selected,
    select,
    filteredEvents,
    setFilter
  } = useContext(SiprojurisContext);
  const { grouping, displayTypes } = useContext(SiprojurisTimelineContext);

  const $dom = useRef<{
    axis: SVGGElement;
    brush: SVGGElement;
    context: SVGSVGElement;
    events: Nullable<HTMLCollectionOf<HTMLDivElement>>;
    timeline: HTMLDivElement;
    filter: SVGGElement;
  }>({
    timeline: null,
    context: null,
    events: null,
    axis: null,
    brush: null,
    filter: null
  } as any);

  const [visTl, setVisTl] = useState<vis.Timeline>();

  const [width, setWidth] = useState(1400);

  const $svg = useRef<{
    context: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    axis: d3.Selection<SVGGElement, unknown, null, undefined>;
    window: d3.Selection<SVGGElement, unknown, null, undefined>;
    filter: d3.Selection<SVGGElement, unknown, null, undefined>;
  }>({} as any);

  const d3Ref = useRef<{
    axis: d3.Axis<number | Date | { valueOf(): number }>;
    filter: d3.BrushBehavior<unknown>;
    window: d3.BrushBehavior<unknown>;
    x: d3.ScaleTime<number, number>;
  }>({} as any);

  useEffect(() => {
    setFilter('display', (e: AnyEvent) => displayTypes[e.kind]);
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

  // on create :)
  useEffect(() => {
    const $timeline = $dom.current.timeline;
    // put timeline logic here
    const timeline = new vis.Timeline($timeline, timelineEvents, [], options);

    timeline.on('changed', (e: any) => actions.current.changed(e));
    timeline.on('click', (e: any) => actions.current.__click(e));
    timeline.on('dragover', (e: any) => actions.current.__drag(e));

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
      if (mouse.click) actions.current.click(e);

      mouse.dragging = false;
      mouse.click = false;
    });

    timeline.on('mouseOver', (e: any) => actions.current.mouseOver(e));

    const updateContext = _.throttle((interval: vis.TimelineWindow) => {
      if ($svg.current.window)
        return $svg.current.window.call(
          d3Ref.current.window.move,
          [interval.start, interval.end].map(d3Ref.current.x)
        );
    }, 16);

    timeline.on('rangechange', (e: any) => {
      if (d3Ref.current && e.byUser) {
        updateContext(e);
      }
    });

    timeline.addCustomTime(undefined as any, 'start');
    timeline.addCustomTime(undefined as any, 'end');

    $($timeline).popover({
      selector: '[data-popover="true"]',
      trigger: 'hover',
      placement: 'top',
      content: function() {
        return this.getAttribute('data-label') || '';
      }
    });

    $dom.current.events = $timeline.getElementsByClassName(
      'timeline-event'
    ) as any;

    setVisTl(timeline);

    // D3 INIT

    $svg.current.context = d3.select($dom.current.context);
    d3Ref.current.x = d3
      .scaleTime()
      .domain([moment(options.min), moment(options.max)])
      .nice()
      .range([5, width - 5])
      .clamp(true);
    $svg.current.axis = d3.select($dom.current.axis);

    d3Ref.current.axis = d3.axisBottom(d3Ref.current.x);
    // .ticks(d3.timeYear.every(10))
    // .tickFormat((x: any) => {
    //   return moment(x).year() % 20 === 0 ? d3.timeFormat('%Y')(x) : '';
    // });

    const updateWindow = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(d3Ref.current.x.invert);
      timeline.setWindow(start, end, {
        animation: false
      });
    }, 16);

    d3Ref.current.window = d3.brushX().on('start brush end', function() {
      if (d3.event.sourceEvent && d3.event.selection) {
        updateWindow(d3.event.selection);
      }
    });
    $svg.current.window = d3.select($dom.current.brush);

    const updateFilter = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(d3Ref.current.x.invert);
      console.log(start, end);

      setFilter('interval', (e: any) =>
        _.some(e.datation, datation => {
          console.log(datation);
          return moment(datation.clean_date).isBetween(start, end);
        })
      );
    }, 100);

    d3Ref.current.filter = d3.brushX().on('brush', function() {
      const [start, end] = d3.event.selection.map(d3Ref.current.x.invert);
      timeline.setCustomTime(start, 'start');
      timeline.setCustomTime(end, 'end');
      updateFilter(d3.event.selection);
    });
    $svg.current.filter = d3.select($dom.current.filter);

    return () => {
      timeline.destroy();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const change = function() {
      if ($dom.current.timeline) {
        const boundingRect = $dom.current.timeline.getBoundingClientRect();
        if (width !== boundingRect.width) {
          setWidth(boundingRect.width);
        }
      }
      if ($dom.current.events) {
        _.forEach($dom.current.events, $event => {
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

    actions.current.changed = change;
  }, [selected, width]);

  useEffect(() => {
    actions.current.click = (e: VisEvent) => {
      if (e.what === 'group-label') {
        console.log('selection:group', e.group);
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
            console.log('selection:item', e.item);
            // is not selected
            select(_.concat(selected || [], e.item));
          } else {
            console.log('selection:item:unselect', e.item);
            const filtered = _.filter(selected, i => i !== e.item);
            select(filtered.length === 0 ? undefined : filtered);
          }
        } else {
          select([e.item]);
        }
      } else {
        if (!e.event.ctrlKey || e.event.metaKey) {
          console.log('selection:reset');
          select();
        }
      }
    };
  }, [selected, select, timelineEvents]);

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

  useEffect(() => {
    if (visTl) visTl.setItems(timelineEvents);
    // visTimeline.current!.redraw();
  }, [visTl, timelineEvents]);

  useEffect(() => {
    if (!visTl) return;
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
    // Set Groups
    visTl.setGroups(
      _.map(grouping.groups(filteredEvents), ({ id, label }) => ({
        id,
        content: newLineLongString(label)
      }))
    );
    // visTimeline.current!.redraw();
  }, [visTl, grouping, filteredEvents]);

  useEffect(() => {
    if ($dom.current.axis && d3Ref.current && width !== 0 && visTl) {
      d3Ref.current.x.range([
        ctxOptions.margin.left,
        width - ctxOptions.margin.right
      ]);
      $svg.current.axis.call(d3Ref.current.axis);

      d3Ref.current.window.extent([
        [ctxOptions.window.left, ctxOptions.window.top],
        [
          width - ctxOptions.window.right,
          ctxOptions.height - ctxOptions.window.bottom
        ]
      ]);
      $svg.current.window.call(d3Ref.current.window).call(g =>
        g
          .select('.overlay')
          .datum({ type: 'selection' })
          .on('mousedown touchstart', function(this: any) {
            const [start, end] = d3.brushSelection($dom.current.brush) as [
              number,
              number
            ];

            const dx = end - start;
            const [cx] = d3.mouse(this);

            const [x0, x1] = [cx - dx / 2, cx + dx / 2];
            const [X0, X1] = d3Ref.current.x.range();

            d3.select(this.parentNode).call(
              d3Ref.current.window.move,
              x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
            );
          })
      );

      d3Ref.current.filter.extent([
        [ctxOptions.filter.left, ctxOptions.filter.top],
        [
          width - ctxOptions.filter.right,
          ctxOptions.height - ctxOptions.filter.bottom
        ]
      ]);
      $svg.current.filter
        .call(d3Ref.current.filter)
        .call(d3Ref.current.filter.move, [
          ctxOptions.filter.left,
          width - ctxOptions.filter.right
        ]);

      const interval = visTl.getWindow();

      $svg.current.window.call(
        d3Ref.current.window.move,
        [interval.start, interval.end].map(d3Ref.current.x)
      );
    }
  }, [width]);

  return (
    <>
      <div id="timeline" ref={el => ($dom.current.timeline = el!)}></div>
      <svg
        id="timeline-context"
        ref={el => ($dom.current.context = el!)}
        width="100%"
        height={ctxOptions.height + 'px'}
      >
        <g
          id="context-axis"
          className="axis"
          ref={el => ($dom.current.axis = el!)}
          transform={`translate(0, ${ctxOptions.height - 35})`}
        ></g>
        <g
          id="context-filter"
          className="brush"
          ref={el => ($dom.current.filter = el!)}
        ></g>
        <g
          id="context-window"
          className="brush"
          ref={el => ($dom.current.brush = el!)}
        ></g>
      </svg>
    </>
  );
};
