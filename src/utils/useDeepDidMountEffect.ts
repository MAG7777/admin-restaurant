import { useRef } from 'react';

import { useDeepEffect } from './useDeepEffect';

// Custom Hook, which ignore first render and run in the same phase that componentDidUpdate does
export const useDeepDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useDeepEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
