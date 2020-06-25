import { combineReducers, createStore } from 'redux';
import * as reducers from './reducers';
// import { composeWithDevTools } from 'redux-devtools-extension';

const store = {
  configure: preloadedState => {
    // const composeEnhancers = composeWithDevTools({
    //   serialize: true,
    // });
    Object.assign(
      store,
      createStore(
        combineReducers(reducers),
        preloadedState,
        // composeEnhancers(applyMiddleware(loggerMiddleware)),
      ),
    );
  },
  /**
   * Assign from store instance after init()
   */
  dispatch: action => {},
  subscribe: listener => {},
  getState: () => {},
};

export default store;
