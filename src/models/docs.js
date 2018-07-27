import { message } from 'antd';
// import sortBy from 'lodash/sortBy';
import { queryAllList, createItem, updateDetail, deleteItem } from '../services/api';

export default {
  namespace: 'docs',

  state: {
    list: [],
    data: {},
  },

  effects: {
    *fetchDocs(_, { call, put }) {
      const { response } = yield call(queryAllList, { sql: 'Doc' });
      if (response) {
        yield put({
          type: 'saveDocs',
          payload: response,
        });
      }
    },
    *fetchAddDoc(_, { call, put, select }) {
      const {
        docs: { data },
      } = yield select();
      const { response } = yield call(createItem, { sql: 'Doc', ...data });
      if (response) {
        message.info('添加成功');
        yield put({
          type: 'addDoc',
          payload: false,
        });
      }
    },
    *fetchUpdateDoc({ payload }, { call, put }) {
      const { response } = yield call(updateDetail, { sql: 'Doc', ...payload });
      if (response) {
        message.info('更新成功');
        yield put({
          type: 'tasks/fetchDocs',
        });
      }
    },
    *fetchDeleteDoc({ payload }, { call, put }) {
      const { response } = yield call(deleteItem, { sql: 'Doc', ...payload });
      if (response) {
        message.info('删除成功');
        yield put({
          type: 'tasks/fetchDocs',
        });
      }
    },
  },

  reducers: {
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
    saveDocs(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
