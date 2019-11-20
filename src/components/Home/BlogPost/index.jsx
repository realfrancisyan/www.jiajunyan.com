import React from 'react';
import '../../../components/Home/Posts/index.scss';
import Skeleton from '../../Skeleton';
import { getSinglePost } from '../../../api/blog';
import moment from 'moment';
import Carousel, { Modal, ModalGateway } from 'react-images';
import bindAll from 'lodash.bindall';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../Posts/CodeBlock';
import { withRouter } from 'react-router-dom';
import './index.scss';

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
      id: props.match.params.id
    };

    bindAll(this, ['toggleModal', 'handleGetList', 'handleReset']);
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

  // 获取文章列表
  handleGetList() {
    const { id } = this.state;
    // 如果没有 id，返回首页
    if (!id) {
      this.props.history.push('/');
      return;
    }

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        // 如果返回对象为空，表示没结果，返回首页
        if (Object.keys(res.data).length === 0) {
          this.props.history.push('/');
          return;
        }

        this.setState({
          isFirstLoad: false,
          posts: [res.data]
        });

        // 设置标题
        document.title = `${res.data.title} - Jiajun Yan`;
      }
    };

    // 列表使用缓存
    const useCache = true;
    getSinglePost({ id }, useCache).then(onSuccess);
  }

  // 图片预览 modal
  toggleModal() {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
  }

  handleReset() {
    return new Promise((resolve, reject) => {
      this.setState({
        isFirstLoad: true,
        posts: [],
        modalIsOpen: false,
        images: []
      });

      resolve();
    });
  }

  async componentDidMount() {
    await this.handleReset();
    this.handleGetInnerHeight();
    this.handleGetList();
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
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
                  <div className="post blog-post" key={index}>
                    <div className="top">
                      <div className="left">
                        <h2>{item.title}</h2>
                        <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
                      </div>
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
        </div>

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

export default withRouter(Posts);
