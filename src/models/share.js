import { message } from 'antd';
// import sortBy from 'lodash/sortBy';
import { queryAllList, createItem, updateDetail, deleteItem } from '../services/api';

export default {
  namespace: 'share',

  state: {
    list: [],
    addShare: false,
    data: {},
  },

  effects: {
    *fetchShare(_, { call, put }) {
      const { response } = yield call(queryAllList, { sql: 'Share' });
      if (response) {
        yield put({
          type: 'saveShare',
          payload: response,
        });
      }
    },
    *fetchAddShare(_, { call, put, select }) {
      const {
        tasks: { data },
      } = yield select();
      const { response } = yield call(createItem, { sql: 'Share', ...data });
      if (response) {
        message.info('添加成功');
        yield put({
          type: 'addShare',
          payload: false,
        });
        yield put({
          type: 'share/cancelAddShare',
        });
        yield put({
          type: 'share/fetchShare',
        });
      }
    },
    *fetchUpdateShare({ payload }, { call, put }) {
      const { response } = yield call(updateDetail, { sql: 'Share', ...payload });
      if (response) {
        message.info('更新成功');
        yield put({
          type: 'share/fetchShare',
        });
      }
    },
    *fetchDeleteShare({ payload }, { call, put }) {
      const { response } = yield call(deleteItem, { sql: 'Share', ...payload });
      if (response) {
        message.info('删除成功');
        yield put({
          type: 'share/fetchShare',
        });
      }
    },
  },

  reducers: {
    cancelAddTask(state) {
      return {
        ...state,
        data: {},
      };
    },
    addData(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
          userId: 0,
        },
      };
    },
    addShare(state, action) {
      return {
        ...state,
        addShare: action.payload,
      };
    },
    saveShare(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
