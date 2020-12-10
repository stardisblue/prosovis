import { useMemo } from 'react';
import * as d3 from 'd3';

/**
 * create a vertical path using d3.line
 * @param height height of the line
 */
export function usePath(height: number) {
  return useMemo(
    () =>
      d3.line().context(null)([
        [0, 0],
        [2, 0],
        [2, height - 10],
        [0, height - 10],
        [0, 0],
      ])!,
    [height]
  );
}
