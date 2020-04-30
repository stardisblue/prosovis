import { useRef, useLayoutEffect } from 'react';
import { select } from 'd3-selection';
/**
 * Binds datum to reference using useLayoutEffect and returns the reference
 * @param datum Datum to bind
 */
function useD3<E extends Element, Datum = any>(datum: Datum) {
  const $dom = useRef<E>(null as any);
  useLayoutEffect(function () {
    // ($line.current as any).__data__ = datum; // cheating
    const d3G = select<E, Datum>($dom.current).datum(datum);
    return () => {
      d3G.datum(null); // cleaning because i'm a good boy
    };
    // eslint-disable-next-line
  }, []);
  return $dom;
}

export default useD3;
