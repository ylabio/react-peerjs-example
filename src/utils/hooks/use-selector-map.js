import { useSelector, shallowEqual } from 'react-redux';

export default function useSelectorMap(selector, isEqual) {
  return useSelector(selector, isEqual || shallowEqual);
}
