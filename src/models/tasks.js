import { message } from 'antd';
import sortBy from 'lodash/sortBy';
import { queryAllList, createItem, updateDetail, deleteItem } from '../services/api';

export default {
  namespace: 'tasks',

  state: {
    list: {},
    addTask: false,
    data: {},
    status: 0,
  },

  effects: {
    *fetchTasks(_, { call, put }) {
      const { response } = yield call(queryAllList, { sql: 'Todo' });
      if (response) {
        yield put({
          type: 'saveTasks',
          payload: sortBy(response, item => item.status),
        });
      }
    },
    *fetchAddTask(_, { call, put, select }) {
      const {
        tasks: { data },
      } = yield select();
      const { response } = yield call(createItem, { sql: 'Todo', ...data });
      if (response) {
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
    *fetchUpdateTask({ payload }, { call, put }) {
      const { response } = yield call(updateDetail, { sql: 'Todo', ...payload });
      if (response) {
        message.info('更新成功');
        yield put({
          type: 'tasks/fetchTasks',
        });
      }
    },
    *fetchDeleteTask({ payload }, { call, put }) {
      const { response } = yield call(deleteItem, { sql: 'Todo', ...payload });
      if (response) {
        message.info('删除成功');
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
