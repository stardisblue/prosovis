import { useRef } from 'react';
export function useMouse() {
  return useRef({
    click: false,
    dragging: false,
    x: 0,
    y: 0,
    draggingTreshold: (
      mouse: {
        x: number;
        y: number;
      },
      event: {
        pageX: number;
        pageY: number;
      }
    ) => Math.abs(mouse.x - event.pageX) + Math.abs(mouse.y - event.pageY) > 6
  }).current;
}
