import React, { useState, useLayoutEffect } from 'react';
function useDimensions<T extends HTMLElement | SVGElement>(
  ref: React.MutableRefObject<T>
) {
  const [dims, setDims] = useState(() =>
    ref.current ? getDimensionObject(ref.current) : null
  );

  useLayoutEffect(() => {
    ref.current && setDims(getDimensionObject(ref.current));
  }, [ref]);

  return dims;
}

export function getDimensionObject<T extends HTMLElement | SVGElement>(
  node: T
) {
  const rect = node.getBoundingClientRect();

  return rect;
}

export default useDimensions;
