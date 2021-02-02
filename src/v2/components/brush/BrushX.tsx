import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { useSelect } from '../../d3-hooks/useSelect';
import { StyledG } from './styled';
import { brushHandles } from './brushHandles';
import { usePath } from './usePath';
import { useBrushX } from '../../d3-hooks/useBrushX';

/**
 * Creates a brush with handles, spanning across margin.top > height - margin.bottom and margin.left > width - margin.right
 * @param props
 */
export const BrushX: React.FC<{
  onBrush: (start: Date, end: Date) => void;
  sync?: [Date, Date];
  x: d3.ScaleTime<number, number>;
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
}> = function ({ onBrush, x, sync, margin, width, height }) {
  const brush = useBrushX();
  const [mask, refFn] = useSelect(brush);

  const path = usePath(height);

  useEffect(() => {
    brush.extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom],
    ]);
    mask.current
      .call(brushHandles, [margin.left, width - margin.right], path, height)
      .call(brush)
      .call(brush.move, [margin.left, width - margin.right]);
  }, [brush, path, mask, width, height, margin]);

  useEffect(() => {
    if (!sync) return;
    mask.current.call(brush.move, sync.map(x));
  }, [brush, mask, sync, x]);

  useEffect(() => {
    brush.on('start brush end', function (event: any) {
      if (event.selection) {
        d3.select(this).call(brushHandles, event.selection, path, height);

        if (event.sourceEvent) {
          const [start, end] = event.selection.map(x.invert);
          onBrush(start, end);
        }
      }
    });

    return () => {
      brush.on('start brush end', null);
    };
  }, [brush, path, onBrush, height, x]);

  return <StyledG ref={refFn} />;
};

export default BrushX;
