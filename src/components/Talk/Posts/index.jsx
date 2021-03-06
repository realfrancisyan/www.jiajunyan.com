import React from 'react';
import './index.scss';
import Skeleton from '../../Skeleton';
import { getPosts, deletePost } from '../../../api/talk';
import moment from 'moment';
import bindAll from 'lodash.bindall';
import PlusIcon from './images/plus.png';
import TalkPostModal from '../PostModal';
import openSocket from 'socket.io-client';
import { parseToken } from '../../../common';
import throttle from 'lodash.throttle';
import { BASE_URL } from '../../../api/url';
import { clearCache } from '../../../api/cache';
import ReactMarkdown from 'react-markdown';
import { SAVE_TALK_STATE } from '../../../common/actionTypes';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

const socket = openSocket.connect(BASE_URL);

let pageScrollTop = 0;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onSaveState: payload => dispatch({ type: SAVE_TALK_STATE, payload })
});

const SkeletonContainer = props => {
  if (props.isFirstLoad) {
    return (
      <div className="skeleton-container">
        {props.skeleton.map(item => (
          <Skeleton key={item}></Skeleton>
        ))}
      </div>
    );
  }

  return null;
};

class TalkPosts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstLoad: true,
      skeleton: [],
      posts: [],
      images: [],
      postModalIsOpen: false,
      hasNewPost: false,
      token: '',
      hasMore: true, // 是否有更多文章
      page: {
        pageNo: 1,
        pageSize: 10
      }
    };

    bindAll(this, [
      'handleTogglePostModal',
      'handleGetList',
      'handleRefresh',
      'handleReset',
      'onScroll'
    ]);

    this.handleGetList = throttle(this.handleGetList, 1500);
  }

  onScroll() {
    const scrollTop = document.documentElement.scrollTop;
    pageScrollTop = scrollTop;
  }

  // 获取屏幕高度
  handleGetInnerHeight() {
    const handleSetInnerHeight = () => {
      this.handleCreateSkeleton();
    };
    handleSetInnerHeight();
  }

  // 根据屏幕高度设置骨架屏个数
  handleCreateSkeleton() {
    const skeletonCount = Math.round(window.innerHeight / 120);
    this.setState({
      skeleton: [...Array(skeletonCount).keys()]
    });
  }

  // 重置
  handleReset() {
    return new Promise(resolve => {
      this.setState(prevState => ({
        page: {
          ...prevState.page,
          pageNo: 1
        },
        isFirstLoad: true,
        posts: [],
        hasMore: true
      }));

      resolve();
    });
  }

  // 获取文章列表
  handleGetList() {
    let { pageNo, pageSize } = this.state.page;
    const params = {
      pageNo,
      pageSize
    };

    if (!this.state.hasMore) return;

    if (this.isLoading) return;
    this.isLoading = true;

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        if (!res.data.length) {
          this.setState({
            hasMore: false
          });
          return;
        }
        this.setState(prevState => ({
          page: {
            ...prevState.page,
            pageNo: pageNo + 1
          },
          isFirstLoad: false,
          posts: [...this.state.posts, ...res.data]
        }));
      }
    };

    // 列表使用缓存
    const useCache = true;
    getPosts(params, useCache)
      .then(onSuccess)
      .finally(() => {
        this.isLoading = false;
      });
  }

  handleDeletePost(post) {
    const r = window.confirm(`确认删除${post.title}？`);
    if (r) {
      // 删除
      deletePost({ id: post.id }).then(res => {
        if (res.message === 'SUCCESS') {
          // 刷新页面时，先删除缓存
          clearCache('/talk/public/getPosts');

          this.handleReset();
          this.handleGetList();
        }
      });
    }
  }

  async handleRefresh() {
    // 刷新页面时，先删除缓存
    clearCache('/talk/public/getPosts');

    this.setState({
      hasNewPost: false
    });
    await this.handleReset();
    this.handleGetList();
    window.scrollTo(0, 0);
  }

  // 创建文章 modal
  handleTogglePostModal() {
    this.setState(state => ({ postModalIsOpen: !state.postModalIsOpen }));
  }

  // 建立 web socket 连接
  handleSetUpWebSocket() {
    // listen for events
    socket.on('newTalkPost', data => {
      // 非登录用户才会显示新文章按钮
      const token = this.handleCheckToken();
      if (!token) {
        this.setState({
          hasNewPost: true
        });
      }
    });
  }

  handleCheckToken() {
    const { token } = parseToken();
    this.setState({
      token
    });
    return token;
  }

  // 保存状态，用于跳转另外页面后，再返回
  handleSaveState() {
    const stateToSave = {
      ...this.state,
      pageScrollTop // 保存当前浏览的高度
    };

    // 退出页面时保存状态
    this.props.onSaveState(stateToSave);
  }

  // 如果之前加载过这个页面，并从另外一个页面返回，获取之前的 state 状态
  handleGetPreviousState() {
    const { talkState } = this.props.state;
    const hasState = Object.keys(talkState).length > 0;

    // 如果有之前保存的状态，setState 获取之后，scroll 到指定到高度
    // 这里的 pageScrollTop 要重置
    if (hasState) {
      this.setState({ ...talkState, pageScrollTop: 0 }, () => {
        setTimeout(() => {
          window.scrollTo(0, talkState.pageScrollTop);
        });
      });
    }

    return hasState;
  }

  componentDidMount() {
    // 添加函数节流控制
    window.addEventListener('scroll', this.onScroll);

    this.handleSetUpWebSocket();
    if (this.handleGetPreviousState()) return;
    window.scrollTo(0, 0);
    this.handleGetInnerHeight();
    this.handleGetList();
    this.handleCheckToken();
  }

  componentWillUnmount() {
    // 移除函数节流
    window.removeEventListener('scroll', this.onScroll);

    // 销毁页面前，保存状态
    this.handleSaveState();

    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="posts-container">
        <SkeletonContainer
          isFirstLoad={this.state.isFirstLoad}
          skeleton={this.state.skeleton}
        ></SkeletonContainer>
        {!this.state.isFirstLoad ? (
          <div className="posts">
            <InfiniteScroll
              loadMore={this.handleGetList}
              hasMore={this.state.hasMore}
              loader={
                <div className="loader" key={0}>
                  正在加载...
                </div>
              }
            >
              {this.state.posts.map((item, index) => {
                return (
                  <div className="post" key={index}>
                    <div className="top">
                      <div className="left">
                        <h2>{item.title}</h2>
                        <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
                      </div>
                      {this.state.token ? (
                        <div className="right">
                          <span onClick={() => this.handleDeletePost(item)}>
                            删除
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="bottom">
                      <ReactMarkdown
                        className={'markdown'}
                        source={item.body}
                        renderers={{
                          image: props => {
                            const image = {
                              src: props.src.replace(
                                'auracloudapp.oss-cn-shenzhen.aliyuncs.com',
                                'assets.auracloudapp.com'
                              )
                            };
                            return (
                              <a
                                href={image.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ outline: 'none' }}
                              >
                                <img
                                  className="post-img"
                                  src={image.src}
                                  alt={props.title}
                                />
                              </a>
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : null}
        {this.state.token ? (
          <div className="add-post" onClick={this.handleTogglePostModal}>
            <img src={PlusIcon} alt="add post" />
          </div>
        ) : null}
        {this.state.postModalIsOpen ? (
          <TalkPostModal
            handleTogglePostModal={this.handleTogglePostModal}
            handleGetList={this.handleGetList}
            handleReset={this.handleReset}
          ></TalkPostModal>
        ) : null}
        {this.state.hasNewPost ? (
          <h4 className="new-post" onClick={this.handleRefresh}>
            有新文章
          </h4>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
})(TalkPosts);
