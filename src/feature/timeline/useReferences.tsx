import { useCallback, useRef, useState } from 'react';
import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import { Nullable } from '../../v2/types/utils';
import * as vis from 'vis-timeline/peer';

function refNotNull<T>(f: (dom: T) => any) {
  return function (dom: Nullable<T>) {
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
      horizontal: 3, // distance
      vertical: 1,
    },
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
    'popover',
  ],
  verticalScroll: true,
  horizontalScroll: true,
};

export function useReferences() {
  const [timeline, setTimeline] = useState<{
    dom: HTMLDivElement;
    vis: vis.Timeline;
  }>();

  const $events = useRef<HTMLCollectionOf<HTMLDivElement>>();

  return {
    $events,

    timeline,
    // eslint-disable-next-line
    timelineRef: useCallback(
      refNotNull(function (dom: HTMLDivElement) {
        // put timeline logic here
        // let observer = new MutationObserver(() => {
        //   dom.querySelectorAll(`[data-popover="true"]`).forEach((v) => {
        //     console.log(dom);

        //     const $tooltip = document.createElement('div');
        //     $tooltip.innerHTML = v.getAttribute('date-label') || '';
        //     createPopper(v, $tooltip, { placement: 'top' });
        //   });
        // });

        // observer.observe(dom, { childList: true, subtree: true });

        // TODO change this :(
        $(dom).popover({
          selector: '[data-popover="true"]',
          trigger: 'hover',
          placement: 'top',
          content: function () {
            return this.getAttribute('data-label') || '';
          },
        });

        $events.current = dom.getElementsByClassName('timeline-event') as any;

        const visTimeline = new vis.Timeline(dom, [], [], options);
        visTimeline.addCustomTime(undefined as any, 'a');
        visTimeline.addCustomTime(undefined as any, 'b');
        setTimeline({
          vis: visTimeline,
          dom,
        });
      }),
      // eslint-disable-next-line
      []
    ),
  };
}
