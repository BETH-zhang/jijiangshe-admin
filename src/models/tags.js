import { queryAllList } from '../services/api';
import { arrayToObjectByField } from '../utils/utils';

export default {
  namespace: 'tags',

  state: {
    list: [],
    data: {},
  },

  effects: {
    *fetchAllTags(_, { call, put }) {
      const { response } = yield call(queryAllList, { sql: 'Tag' });
      const tags = arrayToObjectByField(response, 'id');
      yield put({
        type: 'saveTags',
        payload: tags,
      });
      yield put({
        type: 'saveTagsList',
        payload: response || [],
      });
    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTagsList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
