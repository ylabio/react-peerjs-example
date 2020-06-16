import store from '@store';
import * as api from '@api';
import history from '@app/history';
import qs from 'qs';
import mc from 'merge-change';
import initState, { types } from './state.js';

const actions = {
  init: async (params = {}) => {
    let newParams = { ...initState.params };

    const searchParams = history.getSearchParams();
    if (searchParams.limit) {
      newParams.limit = Math.max(1, Math.min(1000, parseInt(searchParams.limit)));
    }
    if (searchParams.page) {
      newParams.page = Math.max(1, parseInt(searchParams.page));
    }
    // if (searchParams.categoryId) {
    //   newParams.categoryId = searchParams.categoryId;
    // }
    if (searchParams.sort) {
      newParams.sort = searchParams.sort;
    }
    newParams = mc.merge(newParams, params);
    return actions.set(newParams, { mergeParams: false, loadData: true, saveParams: false });
  },

  reset: async (params = {}, options = {}) => {
    options = Object.assign(
      { saveParams: 'replace', loadData: false, clearData: true, mergeParams: false },
      options,
    );
    let newParams = objectUtils.merge(initState.params, params);
    return actions.set(newParams, options);
  },

  set: async (params = {}, options = {}) => {
    options = Object.assign(
      { saveParams: 'replace', mergeParams: true, loadData: true, clearData: false },
      options,
    );
    try {
      let prevState = store.getState().article;
      let newParams = options.mergeParams ? mc.merge(prevState.params, params) : params;

      if (options.clearData) {
        store.dispatch({
          type: types.SET,
          payload: mc.merge(initState, { params: newParams, wait: options.loadData }),
        });
      } else {
        store.dispatch({
          type: types.SET,
          payload: { wait: options.loadData, params: newParams, errors: null },
        });
      }

      if (options.loadData) {
        const queryParams = {
          limit: newParams.limit,
          skip: (newParams.page - 1) * newParams.limit,
          fields: newParams.fields.replace(/\s/g, ''),
          sort: newParams.sort,
          search: {
            category: newParams.categoryId ? newParams.categoryId : undefined,
          },
        };
        const response = await api.articles.getList(queryParams);

        const result = response.data.result;
        store.dispatch({
          type: types.SET,
          payload: mc.patch(result, { wait: false, errors: null }),
        });
      }

      if (options.saveParams) {
        actions.saveParams(newParams, options.saveParams === 'push');
      }
      return true;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        store.dispatch({
          type: types.SET,
          payload: { wait: false, errors: e.response.data.error.data.issues },
        });
      } else {
        throw e;
      }
    }
  },

  saveParams: (params, push = true) => {
    let change = {
      $unset: ['page', 'limit', 'status', /*'categoryId',*/ 'sort'],
      $set: {},
    };
    if (params.page !== initState.params.page) {
      change.$set.page = params.page;
    }
    if (params.limit !== initState.params.limit) {
      change.$set.limit = params.limit;
    }
    // if (params.categoryId !== initState.params.categoryId) {
    //   change.$set.categoryId = params.categoryId;
    // }
    if (params.sort !== initState.params.sort) {
      change.$set.sort = params.sort;
    }
    const currentParams = history.getSearchParams();
    const newParams = mc.merge(currentParams, change);
    let newSearch = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (push) {
      window.history.pushState({}, '', window.location.pathname + newSearch);
    } else {
      window.history.replaceState({}, '', window.location.pathname + newSearch);
    }
    //history.setSearchParams(change, push);
    return true;
  },
};

export default actions;
