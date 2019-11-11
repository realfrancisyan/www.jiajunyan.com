import React from 'react';
import './index.scss';
import Skeleton from '../Skeleton';
import { getPosts, deletePost } from '../../api/talk';
import moment from 'moment';
import Carousel, { Modal, ModalGateway } from 'react-images';
import bindAll from 'lodash.bindall';
import PlusIcon from './images/plus.png';
import PostModal from '../PostModal';
import openSocket from 'socket.io-client';
import { parseToken } from '../../common';
const ReactMarkdown = require('react-markdown');

const socket = openSocket.connect('http://localhost:4000');

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
      isTop: true,
      hasNewPost: false,
      token: ''
    };

    bindAll(this, [
      'toggleModal',
      'handleTogglePostModal',
      'handleGetList',
      'handleWatchScrollPosition',
      'handleRefresh'
    ]);
  }

  // 获取屏幕高度
  handleGetInnerHeight() {
    const handleSetInnerHeight = () => {
      this.handleCreateSkeleton();
    };
    handleSetInnerHeight();
    window.addEventListener('resize', handleSetInnerHeight);
  }

  // 根据屏幕高度设置骨架屏个数
  handleCreateSkeleton() {
    const skeletonCount = Math.round(window.innerHeight / 120);
    this.setState({
      skeleton: [...Array(skeletonCount).keys()]
    });
  }

  handleGetList() {
    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        this.setState({
          isFirstLoad: false,
          posts: res.data
        });
      }
    };

    getPosts().then(onSuccess);
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
          this.handleGetList();
        }
      });
    }
  }

  handleRefresh() {
    this.setState({
      hasNewPost: false
    });
    this.handleGetList();
    window.scrollTo(0, 0);
  }

  // 创建文章 modal
  handleTogglePostModal() {
    this.setState(state => ({ postModalIsOpen: !state.postModalIsOpen }));
  }

  componentDidMount() {
    this.handleGetInnerHeight();
    this.handleGetList();
    this.handleWatchScrollPosition();
    this.handleSetUpWebSocket();
    this.handleCheckToken();
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

  handleWatchScrollPosition() {
    window.onscroll = () => {
      this.setState({
        isTop: window.pageYOffset === 0
      });
    };
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { modalIsOpen } = this.state;
    return (
      <div className="posts-container">
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

        {this.state.token ? (
          <div className="add-post" onClick={this.handleTogglePostModal}>
            <img src={PlusIcon} alt="add post" />
          </div>
        ) : null}

        {this.state.postModalIsOpen ? (
          <PostModal
            handleTogglePostModal={this.handleTogglePostModal}
            handleGetList={this.handleGetList}
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
          <h4
            className="new-post"
            style={{ top: this.state.isTop ? '10rem' : '5rem' }}
            onClick={this.handleRefresh}
          >
            有新文章
          </h4>
        ) : null}
      </div>
    );
  }
}

export default Posts;
