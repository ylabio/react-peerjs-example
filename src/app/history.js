import { createBrowserHistory, createMemoryHistory } from 'history';
import qs from 'qs';
import mc from 'merge-change';

const history = {
  configure: options => {
    switch (options.type) {
      case 'memory':
        Object.assign(history, createMemoryHistory(options));
        break;
      case 'browser':
      default:
        Object.assign(history, createBrowserHistory(options));
        break;
    }
  },
  /**
   * Assign from history instance after configure
   */
  length: 0,
  action: 'POP',
  location: {},
  createHref: location => {},
  push: (path, state) => {},
  replace: (path, state) => {},
  go: n => {},
  goBack: () => {},
  goForward: () => {},
  block: prompt => {},
  listen: listener => {},

  makeHref(path, searchParams = {}, clearSearch = false) {
    const currentParams = history.getSearchParams();
    const newParams = clearSearch ? searchParams : mc.update(currentParams, searchParams);
    let search = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (!path) {
      path = history.getPath();
    }
    return path + search;
  },

  getPath: () => {
    return history.location.pathname;
  },

  getSearchParams: () => {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true, comma: true }) || {};
  },

  setSearchParams: (params, push = true, clear = false, path) => {
    const currentParams = history.getSearchParams();
    const newParams = clear ? params : mc.update(currentParams, params);
    let newSearch = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (push) {
      history.push((path || window.location.pathname) + newSearch + window.location.hash);
    } else {
      history.replace((path || window.location.pathname) + newSearch + window.location.hash);
    }
  },

  clearSearchParams: (push = true) => {
    if (push) {
      history.push(window.location.pathname + window.location.hash);
    } else {
      history.replace(window.location.pathname + window.location.hash);
    }
  },

  goPrivate: (push = true) => {
    push ? history.push('/private') : history.replace('/private');
  },
};

export default history;
