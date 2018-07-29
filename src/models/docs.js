import { message } from 'antd';
// import sortBy from 'lodash/sortBy';
import { queryAllList, createDoc, updateDetail, deleteItem } from '../services/api';
import config from '../common/config';

export default {
  namespace: 'docs',

  state: {
    list: [],
    data: {
      title: '',
      content: '',
      style: '',
    },
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
    *fetchAddDoc({ payload }, { call, select }) {
      const {
        docs: { data },
      } = yield select();
      const { response } = yield call(createDoc, { ...data, ...payload });
      if (response) {
        if (response.preview) {
          window.open(`${config.api}${response.preview}`);
        } else {
          message.info('添加成功');
        }
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
