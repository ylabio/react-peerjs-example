import {useCallback, useMemo} from 'react';

export default function useCallbackMap(callbacks, input = []) {
  return useMemo(() => callbacks, input);
}
