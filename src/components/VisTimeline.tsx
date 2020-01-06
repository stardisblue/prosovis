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

  const [width, setWidth] = useState(1400);

  const $events = useRef<HTMLCollectionOf<HTMLDivElement>>();

  const [axis, setAxis] = useState<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    d3Axis: d3.Axis<number | Date | { valueOf(): number }>;
  }>();
  // const [context, setContext] = useState<{
  //   dom: SVGSVGElement;
  //   selection: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  // }>();
  const [contextFilter, setContextFilter] = useState<{
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
    dom: SVGGElement;
  }>();
  const [timeline, setTimeline] = useState<{
    vis: vis.Timeline;
    dom: HTMLDivElement;
  }>();
  const [window, setWindow] = useState<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
  }>();

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

  const timelineRef = useCallback(function($div: Nullable<HTMLDivElement>) {
    // put timeline logic here
    if (!$div) return;
    $($div).popover({
      selector: '[data-popover="true"]',
      trigger: 'hover',
      placement: 'top',
      content: function() {
        return this.getAttribute('data-label') || '';
      }
    });

    $events.current = $div.getElementsByClassName('timeline-event') as any;
    const visTimeline = new vis.Timeline($div, timelineEvents, [], options);
    visTimeline.addCustomTime(undefined as any, 'start');
    visTimeline.addCustomTime(undefined as any, 'end');
    setTimeline({
      vis: visTimeline,
      dom: $div
    });
    // eslint-disable-next-line
  }, []);

  // const contextRef = useCallback(($svg: Nullable<SVGSVGElement>) => {
  //   if (!$svg) return;
  //   setContext({ selection: d3.select($svg), dom: $svg });
  // }, []);

  const [x] = useState(() =>
    d3
      .scaleTime()
      .domain([moment(options.min), moment(options.max)])
      .nice()
      .clamp(true)
  );

  const axisRef = useCallback(function($g: Nullable<SVGGElement>) {
    if (!$g) return;
    setAxis({ dom: $g, selection: d3.select($g), d3Axis: d3.axisBottom(x) });
    //eslint-disable-next-line
  }, []);

  const contextFilterRef = useCallback(function(dom: SVGGElement) {
    if (!dom) return;
    const brush = d3.brushX();
    const selection = d3.select(dom).call(brush);
    setContextFilter({ dom, brush, selection });
  }, []);

  useEffect(() => {
    if (!timeline || !contextFilter) return;
    contextFilter.selection.call(contextFilter.brush);

    const updateFilter = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(x.invert);

      setFilter('interval', (e: any) =>
        _.some(e.datation, datation => {
          return moment(datation.clean_date).isBetween(start, end);
        })
      );
    }, 100);

    contextFilter.brush.on('brush', function() {
      const [start, end] = d3.event.selection.map(x.invert);
      timeline.vis.setCustomTime(start, 'start');
      timeline.vis.setCustomTime(end, 'end');
      updateFilter(d3.event.selection);
    });
  }, [contextFilter, timeline, setFilter, x.invert]);

  useEffect(() => {
    if (!contextFilter || !timeline) return;
    contextFilter.brush.extent([
      [ctxOptions.filter.left, ctxOptions.filter.top],
      [
        width - ctxOptions.filter.right,
        ctxOptions.height - ctxOptions.filter.bottom
      ]
    ]);
    contextFilter.selection
      .call(contextFilter.brush)
      .call(contextFilter.brush.move, [
        ctxOptions.filter.left,
        width - ctxOptions.filter.right
      ]);
  }, [timeline, contextFilter, width]);

  const windowRef = useCallback(function(dom: Nullable<SVGGElement>) {
    if (!dom) return;
    const selection = d3.select(dom);
    const brush = d3.brushX();
    setWindow({ dom, selection, brush });
  }, []);

  useEffect(() => {
    if (!timeline || !window) return;
    const updateWindow = _.throttle((selection: number[]) => {
      const [start, end] = selection.map(x.invert);
      timeline.vis.setWindow(start, end, {
        animation: false
      });
    }, 16);

    window.brush.on('start brush end', function() {
      if (d3.event.sourceEvent && d3.event.selection) {
        updateWindow(d3.event.selection);
      }
    });

    const interval = timeline.vis.getWindow();

    window.selection
      .call(window.brush)
      .call(window.brush.move, [interval.start, interval.end].map(x));

    const updateContext = _.throttle((interval: vis.TimelineWindow) => {
      return window.selection.call(
        window.brush.move,
        [interval.start, interval.end].map(x)
      );
    }, 16);

    timeline.vis.on('rangechange', (e: any) => {
      if (e.byUser) {
        updateContext(e);
      }
    });
  }, [timeline, window, x]);

  useEffect(() => {
    if (!window) return;
    window.brush.extent([
      [ctxOptions.window.left, ctxOptions.window.top],
      [
        width - ctxOptions.window.right,
        ctxOptions.height - ctxOptions.window.bottom
      ]
    ]);
    window.selection.call(window.brush).call(g =>
      g
        .select('.overlay')
        .datum({ type: 'selection' })
        .on('mousedown touchstart', function(this: any) {
          const [start, end] = d3.brushSelection(window.dom) as [
            number,
            number
          ];

          const dx = end - start;
          const [cx] = d3.mouse(this);

          const [x0, x1] = [cx - dx / 2, cx + dx / 2];
          const [X0, X1] = x.range();

          d3.select(this.parentNode).call(
            window.brush.move,
            x1 > X1 ? [X1 - dx, X1] : x0 < X0 ? [X0, X0 + dx] : [x0, x1]
          );
        })
    );
  }, [width, window, x]);

  useEffect(() => {
    setFilter('display', (e: AnyEvent) => displayTypes[e.kind]);
  }, [displayTypes, setFilter]);

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

  useEffect(() => {}, [timeline, window, x]);

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
  }, [selected, width, timeline]);

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
    if (timeline) timeline.vis.setItems(timelineEvents);
    // visTimeline.current!.redraw();
  }, [timeline, timelineEvents]);

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
  }, [timeline, grouping, filteredEvents]);

  useEffect(() => {
    if (!axis) return;
    x.range([ctxOptions.margin.left, width - ctxOptions.margin.right]);
    axis.selection.call(axis.d3Axis);
  }, [x, width, axis]);

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
