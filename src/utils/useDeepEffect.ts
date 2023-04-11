import { useEffect, useRef } from 'react';
import * as deepEqual from 'fast-deep-equal/es6/react';
// Custom Hook, which will help us to deeply compare passed elements
// if they are of the object type.

export const useDeepEffect = (fn, deps) => {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) =>
      deepEqual.default(obj, deps[index])
    );

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return fn();
    }
  }, deps);
};
