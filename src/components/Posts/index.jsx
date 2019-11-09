import React from 'react';
import './index.scss';
import Skeleton from '../Skeleton';
import { getPosts } from '../../api/talk';
import moment from 'moment';
import Carousel, { Modal, ModalGateway } from 'react-images';
import bindAll from 'lodash.bindall';
const ReactMarkdown = require('react-markdown');

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
      images: []
    };

    bindAll(this, ['toggleModal']);
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

  toggleModal() {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
  }

  componentDidMount() {
    this.handleGetInnerHeight();
    this.handleGetList();
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
                    <h2>{item.title}</h2>
                    <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
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

        <ModalGateway>
          {modalIsOpen ? (
            <Modal onClose={this.toggleModal}>
              <Carousel views={this.state.images} />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    );
  }
}

export default Posts;
