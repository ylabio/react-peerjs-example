/**
 * Reducer helper
 * @param initState Object
 * @param handlers Object
 * @version 1.0
 * @created 06.03.2016
 */
export default function reducer(initState, handlers) {
  return (state = initState, action = {}) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}
