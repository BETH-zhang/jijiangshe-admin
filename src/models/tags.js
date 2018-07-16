import { queryAllList } from '../services/api';
import { arrayToObjectByField } from '../utils/utils';

export default {
  namespace: 'tags',

  state: {
    list: {},
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryAllList, { sql: 'Tag' });
      const tags = arrayToObjectByField(response.data.slice(0), 'id');
      yield put({
        type: 'saveTags',
        payload: tags,
      });
    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
