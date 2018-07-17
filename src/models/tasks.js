import { message } from 'antd';
import { queryAllList, createItem } from '../services/api';

export default {
  namespace: 'tasks',

  state: {
    list: {},
    addTask: false,
    data: {},
  },

  effects: {
    *fetchTasks(_, { call, put }) {
      const response = yield call(queryAllList, { sql: 'Todo' });
      yield put({
        type: 'saveTasks',
        payload: response,
      });
    },
    *fetchAddTask(_, { call, put, select }) {
      const {
        tasks: { data },
      } = yield select();
      const response = yield call(createItem, { sql: 'Todo', ...data });
      if (response && !response.error) {
        message.info('添加成功');
        yield put({
          type: 'addTask',
          payload: false,
        });
        yield put({
          type: 'cancelAddTask',
        });
        yield put({
          type: 'tasks/fetchTasks',
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
      console.log(state, action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
          userId: 0,
        },
      };
    },
    addTask(state, action) {
      return {
        ...state,
        addTask: action.payload,
      };
    },
    saveTasks(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
