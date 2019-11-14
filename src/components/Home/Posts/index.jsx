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
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

const socket = openSocket.connect(BASE_URL);

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
  if (tagList.length) {
    return (
      <div className="sidebar">
        <h2>分类</h2>
        <ul>
          {tagList.map((tag, index) => {
            return <li key={index}>{tag.name}</li>;
          })}
        </ul>

        <h2>其他</h2>
        <ul>
          <li>Talk</li>
          <li>关于我</li>
        </ul>
      </div>
    );
  }

  return null;
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
      tagList: []
    };

    bindAll(this, [
      'toggleModal',
      'handleTogglePostModal',
      'handleGetList',
      'handleRefresh',
      'handleReset',
      'onScroll'
    ]);

    this.handleGetList = throttle(this.handleGetList, 1500);
  }

  onScroll() {
    const innerHeight = document.querySelector('#root').clientHeight;
    const outerHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    //加载更多操作
    if (innerHeight < outerHeight + scrollTop + 200) {
      this.handleGetList();
    }
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
        console.log(res);
        this.setState({
          tagList: res.data
        });
      }
    };
    getTags().then(onSuccess);
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
          clearCache('/talk/getPosts');

          this.handleReset();
          this.handleGetList();
        }
      });
    }
  }

  async handleRefresh() {
    // 刷新页面时，先删除缓存
    clearCache('/talk/getPosts');

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
    socket.on('newPost', data => {
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

  componentDidMount() {
    this.handleGetTags();
    this.handleGetInnerHeight();
    this.handleGetList();
    this.handleSetUpWebSocket();
    this.handleCheckToken();

    // 添加函数节流控制
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
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
        <div className="blog-posts box500">
          <SkeletonContainer
            isFirstLoad={this.state.isFirstLoad}
            skeleton={this.state.skeleton}
          ></SkeletonContainer>
          {!this.state.isFirstLoad ? (
            <div className="posts">
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
                          code: CodeBlock,
                          image: props => {
                            const images = [{ src: props.src }];
                            const showLightBox = () => {
                              this.setState({
                                images,
                                modalIsOpen: !modalIsOpen
                              });
                            };
                            return (
                              <img
                                className="post-img"
                                src={props.src}
                                alt={props.title}
                                onClick={showLightBox}
                              />
                            );
                          }
                        }}
                      />
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

        <TagContainer tagList={this.state.tagList}></TagContainer>

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

export default Posts;
