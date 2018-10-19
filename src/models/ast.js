export default {
  namespace: 'ast',

  state: {
    content: 'function add () { return 1 + 2; }',
  },

  effects: {},

  reducers: {
    addData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
