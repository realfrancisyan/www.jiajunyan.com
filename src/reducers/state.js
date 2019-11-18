import { SAVE_HOME_STATE } from '../common/actionTypes';

const defaultState = {
  homeState: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // 唤起接口错误提示框
    case SAVE_HOME_STATE:
      return {
        ...state,
        homeState: action.payload
      };

    default:
      return state;
  }
};
