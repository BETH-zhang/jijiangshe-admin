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
      return {
        data: state.newFrame,
        newFrame: '',
        newFrameLink: '',
        newFrames: {
          [state.newFrame]: {
            default: newFrame,
            // defaultExecute: newFrame(),
          },
        },
      };
    },
  },
};
