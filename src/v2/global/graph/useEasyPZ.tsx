import { useLayoutEffect, useMemo, useRef } from 'react';
import useDimensions from '../../../hooks/useDimensions';
import { select } from 'd3';
import { EasyPZ } from 'easypz';

export function useEasyPZ(bounds: { x: number; y: number }) {
  const $svg = useRef<SVGSVGElement>(null as any);
  const $g = useRef<SVGGElement>(null as any);

  const dims = useDimensions($svg as any);

  const baseScale = useMemo(
    () => (dims ? (dims.width - dims.width / 10) / bounds.x : 1),
    [dims, bounds.x]
  );

  useLayoutEffect(() => {
    const childrens = select($g.current);

    const easypz = new EasyPZ(
      $svg.current,
      function (transform) {
        // handleClick.cancel();
        childrens.style(
          'transform',
          `translate3d(${transform.translateX}px, ${
            transform.translateY
          }px, 0) scale(${transform.scale * baseScale})`
        );
      },
      { minScale: 1 },
      ['SIMPLE_PAN', 'WHEEL_ZOOM', 'PINCH_ZOOM']
    );

    return () => {
      easypz.removeHostListeners();
    };
  }, [baseScale]);
  return {
    $svg,
    $g,
    baseScale,
    viewBox: dims
      ? [-dims.width / 20, 0, dims.width, baseScale * bounds.y].join(' ')
      : undefined,
  };
}
