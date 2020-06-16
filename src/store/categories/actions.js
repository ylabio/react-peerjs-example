import store from '@store';
import * as api from '@api';
import listToTree from '@utils/list-to-tree';
import mc from 'merge-change';

export const types = {
  SET: Symbol('SET'),
};

export const initState = {
  items: [],
  roots: [],
  wait: false,
  errors: null,
};

const actions = {
  reset: () => {
    store.dispatch({ type: types.SET, payload: initState });
  },

  load: async params => {
    store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const response = await api.categories.getList(params);
      const result = response.data.result;
      store.dispatch({
        type: types.SET,
        payload: mc.patch(result, { roots: listToTree(result.items), wait: false, errors: null }),
      });
      return result;
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
};

export default actions;
