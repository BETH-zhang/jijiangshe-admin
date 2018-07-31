export default {
  namespace: 'frame',

  state: {
    data: '',
    funcName: '',
    previewContent: '',
  },

  effects: {},

  reducers: {
    changeFrame(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
