import { queryAllList } from '../services/api';
import { arrayToObjectByField } from '../utils/utils';

export default {
  namespace: 'links',

  state: {
    list: {},
  },

  effects: {
    *fetchAllLinks(_, { call, put }) {
      const response = yield call(queryAllList, { sql: 'WebSite' });
      const links = arrayToObjectByField(response, 'tagId', 'tagId');
      yield put({
        type: 'saveAllLinks',
        payload: links,
      });
    },
  },

  reducers: {
    saveAllLinks(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
