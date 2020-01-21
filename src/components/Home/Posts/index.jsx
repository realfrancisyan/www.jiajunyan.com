import React from 'react';
import './index.scss';
import Skeleton from '../../Skeleton';
import { getPosts, deletePost, getTags } from '../../../api/blog';
import moment from 'moment';
import Carousel, { Modal, ModalGateway } from 'react-images';
import bindAll from 'lodash.bindall';
import PlusIcon from './images/plus.png';
import PostModal from '../PostModal';
import openSocket from 'socket.io-client';
import { parseToken } from '../../../common';
import throttle from 'lodash.throttle';
import { BASE_URL } from '../../../api/url';
import { clearCache } from '../../../api/cache';
import { Link } from 'react-router-dom';
import { SAVE_HOME_STATE } from '../../../common/actionTypes';
import { connect } from 'react-redux';

const socket = openSocket.connect(BASE_URL);
let pageScrollTop = 0; // 用于计算页面滚动高度

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onSaveState: payload => dispatch({ type: SAVE_HOME_STATE, payload })
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

const TagContainer = props => {
  const { tagList } = props;

  return (
    <div className="sidebar">
      <h2>分类</h2>
      <ul>
        {tagList.map((tag, index) => {
          return (
            <li
              className={`${
                props.currentType === tag.type ? 'isSelected' : ''
              }`}
              key={index}
              onClick={() => props.handleSelectTag(tag)}
            >
              {tag.name}
            </li>
          );
        })}
      </ul>

      <h2>其他内容</h2>
      <ul>
        <li>
          <Link to="/talk">Talk</Link>
        </li>
      </ul>
    </div>
  );
};

class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstLoad: true,
      skeleton: [],
      posts: [],
      modalIsOpen: false,
      images: [],
      postModalIsOpen: false,
      hasNewPost: false,
      token: '',
      hasMore: true, // 是否有更多文章
      page: {
        pageNo: 1,
        pageSize: 10
      },
      tagList: [],
      tagListObject: {},
      currentType: '',
      htmlFontSize: 0,
      postsHeight: [] // 用于判断显示每篇文章的阅读更多
    };

    bindAll(this, [
      'toggleModal',
      'handleTogglePostModal',
      'handleGetList',
      'handleRefresh',
      'handleReset',
      'onScroll',
      'handleSelectTag'
    ]);

    this.handleGetList = throttle(this.handleGetList, 1000);
  }

  onScroll() {
    const innerHeight = document.querySelector('#root').clientHeight;
    const outerHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    //加载更多操作
    if (innerHeight < outerHeight + scrollTop + 200) {
      this.handleGetList();
    }

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

  handleGetTags() {
    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        const tagListObject = res.data.reduce((result, item) => {
          result[item.type] = item;
          return result;
        }, {});
        this.setState({
          tagList: [{ name: '全部', type: '' }, ...res.data],
          tagListObject
        });
      }
    };
    getTags().then(onSuccess);
  }

  // 获取分类下的文章
  async handleSelectTag(tagItem) {
    await this.handleReset();
    this.setState({
      currentType: tagItem.type
    });

    this.handleGetList();
    window.scrollTo(0, 0);
  }

  // 获取文章列表
  handleGetList() {
    let { pageNo, pageSize } = this.state.page;
    const params = {
      pageNo,
      pageSize
    };

    // 如果没有指定分类，则不传分类
    const { currentType } = this.state;
    if (currentType !== '') {
      params.type = currentType;
    }

    if (!this.state.hasMore) return;

    if (this.isLoading) return;
    this.isLoading = true;

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        // 如果返回为空，则表示没有更多，且停止
        if (!res.data.length) {
          this.setState({
            hasMore: false
          });
          return;
        }

        // 当前为第一页且返回少于 pageSize，则需要设置已加载完毕，修复文章数量过少，浏览器高度不足，导致无法下拉的问题
        if (res.data.length < pageSize && pageNo === 1) {
          this.setState({
            hasMore: false
          });
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

  // 图片预览 modal
  toggleModal() {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
  }

  handleDeletePost(post) {
    const r = window.confirm(`确认删除${post.title}？`);
    if (r) {
      // 删除
      deletePost({ id: post.id }).then(res => {
        if (res.message === 'SUCCESS') {
          // 刷新页面时，先删除缓存
          clearCache('/blog/public/getPosts');

          this.handleReset();
          this.handleGetList();
        }
      });
    }
  }

  async handleRefresh() {
    // 刷新页面时，先删除缓存
    clearCache('/blog/public/getPosts');

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
    socket.on('newBlogPost', data => {
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

  // begin 从其他页面返回后，保存并提取之前浏览的信息和位置。记得还有 pageScrollTop 变量
  // 包含 handleSaveState，handleGetPreviousState，componentDidMount 中的 if (this.handleGetPreviousState()) return;
  // 以及 componentWillUnmount 的 this.handleSaveState();
  // 以及 redux

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
    const { homeState } = this.props.state;
    const hasState = Object.keys(homeState).length > 0;

    // 如果有之前保存的状态，setState 获取之后，scroll 到指定到高度
    // 这里的 pageScrollTop 要重置
    if (hasState) {
      this.setState({ ...homeState, pageScrollTop: 0 }, () => {
        setTimeout(() => {
          window.scrollTo(0, homeState.pageScrollTop);
        });
      });
    }

    return hasState;
  }

  // end 从其他页面返回后，保存并提取之前浏览的信息和位置。记得还有 pageScrollTop 变量

  async componentDidMount() {
    // 添加函数节流控制
    window.addEventListener('scroll', this.onScroll);
    this.handleSetUpWebSocket();
    if (this.handleGetPreviousState()) return;
    this.handleGetTags();
    this.handleGetInnerHeight();
    this.handleCheckToken();
    await this.handleGetList();
  }

  componentWillUnmount() {
    // 销毁页面前，保存状态
    this.handleSaveState();

    // 移除函数节流
    window.removeEventListener('scroll', this.onScroll);

    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { modalIsOpen } = this.state;

    return (
      <div className="blog-container">
        <div className="blog-posts">
          <SkeletonContainer
            isFirstLoad={this.state.isFirstLoad}
            skeleton={this.state.skeleton}
          ></SkeletonContainer>
          {!this.state.isFirstLoad ? (
            <div className="posts box500">
              {this.state.posts.map((item, index) => {
                return (
                  <div className="post" key={index}>
                    <div className="top">
                      <div className="left">
                        <p>
                          {moment(item.createdAt).format('YYYY-MM-DD')}{' '}
                          {Object.keys(this.state.tagListObject).length > 0 ? (
                            <span>
                              · {this.state.tagListObject[item.type].name}
                            </span>
                          ) : (
                            ''
                          )}
                        </p>
                        <Link to={`/post/${item.id}`}>
                          <h2>{item.title}</h2>
                        </Link>
                      </div>
                      {this.state.token ? (
                        <div className="right">
                          <span onClick={() => this.handleDeletePost(item)}>
                            删除
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="loader">
            {this.state.hasMore ? '正在加载...' : '全部加载完毕'}
          </div>
        </div>

        <TagContainer
          tagList={this.state.tagList}
          currentType={this.state.currentType}
          handleSelectTag={this.handleSelectTag}
        ></TagContainer>

        {this.state.token ? (
          <div className="add-post" onClick={this.handleTogglePostModal}>
            <img src={PlusIcon} alt="add post" />
          </div>
        ) : null}
        {this.state.postModalIsOpen ? (
          <PostModal
            handleTogglePostModal={this.handleTogglePostModal}
            handleGetList={this.handleGetList}
            handleReset={this.handleReset}
          ></PostModal>
        ) : null}
        <ModalGateway>
          {modalIsOpen ? (
            <Modal onClose={this.toggleModal}>
              <Carousel views={this.state.images} />
            </Modal>
          ) : null}
        </ModalGateway>
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
})(Posts);
