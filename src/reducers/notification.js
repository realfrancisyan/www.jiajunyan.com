import { ERROR_NOTIFY } from '../common/actionTypes';

const defaultState = {
  errorAlertIsOn: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // 唤起接口错误提示框
    case ERROR_NOTIFY:
      return {
        ...state,
        errorAlertIsOn: action.payload
      };

    default:
      return state;
  }
};
