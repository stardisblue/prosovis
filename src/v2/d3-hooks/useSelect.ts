import React, { useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { noop } from 'lodash/fp';
export type D3Selection = d3.Selection<SVGGElement, unknown, any, undefined>;

export function useSelect(
  callback: (selection: D3Selection, ...args: any[]) => void = noop
): [React.MutableRefObject<D3Selection>, (dom: SVGGElement) => void] {
  const d3selection = useRef<D3Selection>(null as any);
  const ref = useCallback(function (dom: SVGGElement) {
    if (!dom) return;
    d3selection.current = d3.select(dom).call(callback);
    // ignoring callback :)
    //eslint-disable-next-line
  }, []);

  return [d3selection, ref];
}
