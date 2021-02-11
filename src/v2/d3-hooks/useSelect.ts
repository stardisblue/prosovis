import React, { useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { noop } from 'lodash/fp';
export type D3Selection<T extends SVGElement = any> = d3.Selection<
  T,
  unknown,
  any,
  undefined
>;

export function useSelect<T extends SVGElement>(
  callback: (selection: D3Selection<T>, ...args: any[]) => void = noop
): [React.MutableRefObject<D3Selection<T>>, (dom: T) => void] {
  const d3selection = useRef<D3Selection<T>>(null as any);
  const ref = useCallback(function (dom: T) {
    if (!dom) return;
    d3selection.current = d3.select(dom).call(callback);
    // ignoring callback :)
    //eslint-disable-next-line
  }, []);

  return [d3selection, ref];
}
