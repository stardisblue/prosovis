import { useMemo } from 'react';
import * as d3 from 'd3';

/**
 * memoized d3.brushX()
 */
export function useBrushX() {
  return useMemo(() => d3.brushX(), []);
}
