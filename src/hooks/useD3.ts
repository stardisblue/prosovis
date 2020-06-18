import { useRef, useLayoutEffect, useEffect } from 'react';
import { select, Selection } from 'd3-selection';
import { transition } from 'd3-transition';
import loForEach from 'lodash/forEach';
import loKebabCase from 'lodash/kebabCase';
/**
 * Binds datum to reference using useLayoutEffect and returns the reference
 * @param datum Datum to bind
 */
export function useDatum<E extends Element, Datum = any>(datum: Datum) {
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

export function useD3<T extends Element>(): [
  React.MutableRefObject<T>,
  React.MutableRefObject<Selection<T, unknown, null, undefined>>
] {
  const $ref = useRef<T>(null as any);
  const d3Ref = useSelect($ref);
  return [$ref, d3Ref];
}

export function useSelect<T extends Element>(
  ref: React.MutableRefObject<T>
): React.MutableRefObject<Selection<T, unknown, null, undefined>> {
  const d3ref = useRef(ref.current ? select(ref.current) : null!);

  useLayoutEffect(() => {
    d3ref.current = select(ref.current);
  }, [ref]);

  return d3ref;
}

type Styled = { style?: object | string };

type Attributes<T = any> = {
  [K in keyof T]?: number | string;
};

export function useTransition<T extends Element>(
  selection: React.MutableRefObject<d3.Selection<T, any, any, any>>,
  attrs: Styled & Attributes<T>,
  t?: d3.Transition<any, any, any, any>
) {
  const { style, ...attr } = attrs;

  useAttrTransition(selection, attr as any, t);
  useStyleTransition(selection, style, t);

  return selection;
}
export function useAttrTransition<T extends Element>(
  selection: React.MutableRefObject<d3.Selection<T, any, any, any>>,
  attrs?: Attributes<T>,
  t?: d3.Transition<any, any, any, any>
) {
  useEffect(() => {
    if (attrs) {
      let copy = t;
      if (copy === undefined) {
        copy = transition().duration(1000);
      }

      selection.current.transition(copy).call((selection) => {
        loForEach(attrs, (value, key) => {
          selection.attr(loKebabCase(key), value as any);
        });
      });
    }
  }, [selection, attrs, t]);

  return selection;
}

export function useStyleTransition<T extends Element>(
  selection: React.MutableRefObject<d3.Selection<T, any, any, any>>,
  styles?: Styled['style'],
  t?: d3.Transition<any, any, any, any>
) {
  useEffect(() => {
    if (styles) {
      let copy = t;
      if (copy === undefined) {
        copy = transition().duration(1000);
      }

      selection.current.transition(copy).call((selection) => {
        if (typeof styles === 'string') selection.attr('style', styles);
        else
          loForEach(styles, (value, key) => {
            selection.style(loKebabCase(key), value);
          });
        return selection;
      });
    }
  }, [selection, styles, t]);

  return selection;
}
