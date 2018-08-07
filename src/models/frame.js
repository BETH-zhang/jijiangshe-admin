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
    addFrame(state) {
      const newFrame = window[state.newFrame];
      console.log(newFrame, typeof newFrame);
      let defaultExecute = null;
      if (state.newFrameType === 'function') {
        defaultExecute = newFrame();
      }
      console.log(defaultExecute);
      return {
        data: state.newFrame,
        newFrame: '',
        newFrameLink: '',
        newFrameType: '',
        newFrames: {
          [state.newFrame]: {
            default: newFrame,
            defaultExecute,
          },
        },
      };
    },
  },
};
