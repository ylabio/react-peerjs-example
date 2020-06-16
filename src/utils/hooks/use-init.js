import { useEffect } from 'react';

/**
 * Hook for async calculations
 * @param callback {Function}
 * @param inputs {Array}
 * @param onBackForward {Boolean}
 */
export default function useInit(callback, inputs = [], onBackForward = false) {
  if (process.env.IS_NODE && global.SSR_FIRST_RENDER) {
    const promise = callback(true);
    global.pushInitPromise(promise);
    return promise;
  } else {
    useEffect(() => {
      if (!window.SSR_FIRST_RENDER) {
        callback(false);
      }
      if (onBackForward) {
        window.addEventListener('popstate', callback);
        return () => {
          window.removeEventListener('popstate', callback);
        };
      }
    }, inputs);
  }
}
