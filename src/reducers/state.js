import {
  SAVE_HOME_STATE,
  SAVE_TALK_STATE,
  SAVE_DIARY_STATE
} from '../common/actionTypes';

const defaultState = {
  homeState: {},
  talkState: {},
  diaryState: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    // 保存首页 state 状态
    case SAVE_HOME_STATE:
      return {
        ...state,
        homeState: action.payload
      };
    // 保存 talk state 状态
    case SAVE_TALK_STATE:
      return {
        ...state,
        talkState: action.payload
      };
    // 保存日记 state 状态
    case SAVE_DIARY_STATE:
      return {
        ...state,
        diaryState: action.payload
      };

    default:
      return state;
  }
};
