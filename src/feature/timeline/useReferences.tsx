import { useCallback, useRef, useMemo, useState } from 'react';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import { Nullable } from '../../data';
import * as vis from 'vis-timeline/standalone';
import moment from 'moment';
import * as d3 from 'd3';

function refNotNull<T>(f: (dom: T) => any) {
  return function(dom: Nullable<T>) {
    if (!dom) return;
    return f(dom);
  };
}

const options = {
  max: '2000-01-01', //Maximum date of timeline
  min: '1700-01-01', // Minimum date of timeline,
  multiselect: false, // Allow to select multiples items
  selectable: false,
  stack: true, // Stack items
  showTooltips: false,
  width: '100%',
  height: '300px',
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

export function useReferences(timelineEvents: any[]) {
  const [axis, setAxis] = useState<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    d3Axis: d3.Axis<number | Date | { valueOf(): number }>;
  }>();

  // const [context, setContext] = useState<{
  //   dom: SVGSVGElement;
  //   selection: Selection<SVGSVGElement, unknown, null, undefined>;
  // }>();

  const [contextFilter, setContextFilter] = useState<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
  }>();

  const [timeline, setTimeline] = useState<{
    dom: HTMLDivElement;
    vis: vis.Timeline;
  }>();

  const [window, setWindow] = useState<{
    dom: SVGGElement;
    selection: d3.Selection<SVGGElement, unknown, null, undefined>;
    brush: d3.BrushBehavior<unknown>;
  }>();

  const $events = useRef<HTMLCollectionOf<HTMLDivElement>>();
  const x = useMemo(
    () =>
      d3
        .scaleTime()
        .domain([moment(options.min), moment(options.max)])
        .nice()
        .clamp(true),
    []
  );
  return {
    $events,
    axis,
    axisRef: useCallback(
      refNotNull(function(dom: SVGGElement) {
        setAxis({
          dom,
          selection: d3.select(dom),
          d3Axis: d3.axisBottom(x)
        });
      }),
      //eslint-disable-next-line
      []
    ),
    contextFilter,
    contextFilterRef: useCallback(
      refNotNull(function(dom: SVGGElement) {
        const brush = d3.brushX();
        const selection = d3.select(dom).call(brush);
        setContextFilter({ dom, brush, selection });
      }),
      []
    ),
    timeline,
    timelineRef: useCallback(
      refNotNull(function(dom: HTMLDivElement) {
        // put timeline logic here
        $(dom).popover({
          selector: '[data-popover="true"]',
          trigger: 'hover',
          placement: 'top',
          content: function() {
            return this.getAttribute('data-label') || '';
          }
        });

        $events.current = dom.getElementsByClassName('timeline-event') as any;

        const visTimeline = new vis.Timeline(dom, [], [], options);
        visTimeline.addCustomTime(undefined as any, 'a');
        visTimeline.addCustomTime(undefined as any, 'b');
        setTimeline({
          vis: visTimeline,
          dom
        });
      }),
      // eslint-disable-next-line
      []
    ),
    window,
    windowRef: useCallback(
      refNotNull(function(dom: SVGGElement) {
        const brush = d3.brushX();
        const selection = d3.select(dom).call(brush);
        setWindow({ dom, selection, brush });
      }),
      []
    ),
    // contextRef : useCallback(($svg: Nullable<SVGSVGElement>) => {
    //   if (!$svg) return;
    //   setContext({ selection: select($svg), dom: $svg });
    // }, [])
    x
  };
}
