import { useEffect } from 'react';
function useMount(fn: () => (() => void) | void) {
  // eslint-disable-next-line
  useEffect(fn, []);
}

export default useMount;
