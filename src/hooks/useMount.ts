import { useEffect } from 'react';

export default function (fn: () => (() => void) | void) {
  // eslint-disable-next-line
  useEffect(fn, []);
}
