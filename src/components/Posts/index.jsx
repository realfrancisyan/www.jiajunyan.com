import React from 'react';
import './index.scss';
import Skeleton from '../Skeleton';
import { listPosts, listPost } from '../../api/blog';
import moment from 'moment';
import Carousel, { Modal, ModalGateway } from 'react-images';
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
  state = {
    isFirstLoad: true,
    skeleton: [],
    posts: [],
    modalIsOpen: false,
    images: []
  };

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
    const res = {
      data: [
        {
          body:
            '\u6700\u8fd1\u53d1\u73b0\uff0c`iOS` \u5185\u7f6e\u7684\u82f9\u679c\u5730\u56fe\u7ec8\u4e8e\u5230\u4e86\u53ef\u7528\u7684\u7a0b\u5ea6\u4e86\u3002\u754c\u9762\u4f53\u9a8c\u6bd4\u9ad8\u5fb7\u548c\u767e\u5ea6\u8981\u597d\u3002\u7531\u4e8e\u5176\u4f7f\u7528\u7684\u662f\u9ad8\u5fb7\u5730\u56fe\uff0c\u6240\u4ee5\u51c6\u786e\u6027\u5e94\u8be5\u548c\u9ad8\u5fb7\u81ea\u8eab\u6ca1\u6709\u592a\u5927\u5dee\u522b\u3002\u552f\u4e00\u7684\u7f3a\u70b9\u662f\uff0c\u5982\u679c\u624b\u673a\u7cfb\u7edf\u8bed\u8a00\u662f\u82f1\u6587\uff0c\u754c\u9762\u9664\u4e86\u5730\u56fe\u7684\u5730\u6807\u53ef\u4ee5\u8c03\u6574\u4e3a\u4e2d\u6587\uff0c\u5176\u4ed6\u5730\u65b9\u7684\u8bed\u8a00\u4e5f\u53ea\u80fd\u662f\u82f1\u6587\u3002\n\n![](http://ww1.sinaimg.cn/large/0077SeUqgy1g8oscoj6cvj32801kwqod.jpg)',
          createdAt: '2019-11-02 21:15:13',
          id: 'sfuked1573218921',
          tagAlia: 'Tech',
          title: '\u65e5\u5e38\u4f7f\u7528\u82f9\u679c\u5730\u56fe',
          type: 0
        },
        {
          body:
            '![](http://ww1.sinaimg.cn/large/0077SeUqgy1g8osvouy4vj32801hwb29.jpg)\n\n\u6700\u8fd1\u5f88\u559c\u6b22\u6781\u7b80\u98ce\u683c\u7684\u684c\u9762\uff0c\u5f88\u60f3\u6709\u4e00\u5f20\u5f88\u957f\u7684\u767d\u8272\u684c\u9762\uff0c\u7136\u540e\u653e\u7f6e\u6211\u7684\u7b14\u8bb0\u672c\u3001\u663e\u793a\u5668\u548c PS4 \u7b49\u3002\u6211\u8111\u6d77\u4e2d\u5df2\u6709\u5927\u81f4\u60f3\u6cd5\uff0c\u5c31\u5dee\u627e\u623f\u5b50\u4e86\u3002',
          createdAt: '2019-10-31 21:14:41',
          id: 'IUlgxB1573218885',
          tagAlia: 'Life',
          title: 'Minimalist Desk Setup',
          type: 2
        },
        {
          body:
            '\u4ece `Osmo Mobile 3` 8 \u6708\u53d1\u552e\u81f3\u4eca\uff0c\u6211\u4f7f\u7528\u5176\u5df2\u6709 3 \u4e2a\u6708\u7684\u65f6\u95f4\u3002\u5f53\u4e2d\u53d1\u73b0\u4e00\u4e2a\u5341\u5206\u5927\u7684\u95ee\u9898\uff1a\u4f7f\u7528 iPhone \u62cd\u7167 4K \u5f71\u7247\u5341\u5206\u5bb9\u6613\u53d1\u751f\u624b\u673a\u8fc7\u70ed\u73b0\u8c61\uff0c\u5bfc\u81f4\u65e0\u6cd5\u7ee7\u7eed\u62cd\u6444\u3002\n\n\n\n\u5f53\u7136\uff0c`Osmo Mobile 3` \u4e0d\u80fd\u5b8c\u5168\u80cc\u8fd9\u4e2a\u9505\u3002\u6211\u4f7f\u7528\u7684\u662f iPhone X\uff0c\u5373\u4fbf\u5728\u65e0\u624b\u6301\u4e91\u53f0\u7684\u60c5\u51b5\u4e0b\uff0c\u5176\u62cd\u6444 4K \u5f71\u7247\u4e5f\u6491\u4e0d\u4e86\u591a\u4e45\uff0c\u4f55\u51b5\u662f\u5728\u4e25\u9177\u7684\u5e7f\u5dde\u5929\u6c14\u4e0b\u3002\u4e0d\u8fc7\uff0c\u8fc7\u70ed\u95ee\u9898\u5373\u4fbf\u5728\u6709\u7a7a\u8c03\u7684\u60c5\u51b5\u4f9d\u7136\u5b58\u5728\uff0c\u53ea\u4e0d\u8fc7\u591a\u6491\u4e86\u51e0\u5206\u949f\u7f62\u4e86\u3002',
          createdAt: '2019-10-23 21:13:53',
          id: 'gixlPO1573218839',
          tagAlia: 'Tech',
          title: 'Osmo Mobile 3 \u4f7f\u7528\u4f53\u9a8c',
          type: 0
        },
        {
          body:
            '![](http://ww1.sinaimg.cn/large/0077SeUqgy1g8orayi85qj32801kw19b.jpg)\n\n2019 \u5e74\uff0c\u53d7\u5230\u4e86 `Minimalism` \u6781\u7b80\u5316\u751f\u6d3b\u7684\u5f71\u54cd\uff0c\u5f88\u591a apps \u90fd\u88ab\u79fb\u9664\u6216\u8005\u4f7f\u7528\u4e86\u5176\u5c0f\u7a0b\u5e8f\u7684\u4ea7\u54c1\u3002\u5f88\u591a apps \u7ecf\u4e45\u4e0d\u8870\uff0c\u4f46\u4eca\u5e74\u4e5f\u6709\u65b0\u6210\u5458\u52a0\u5165\uff0c\u4f8b\u5982 `Notion` \u548c `Tick Tick`\u3002\n\n- Youtube\n- Spotify\n- Instagram\n- WeChat\n- LastPass\n- Pennies\n- Twitter\n- Things 3\n- Notion\n- Tick Tick',
          createdAt: '2019-10-16 21:12:41',
          id: 'SWpgVE1573218768',
          tagAlia: 'Tech',
          title: '\u6211\u7684\u5e38\u7528 iOS \u8f6f\u4ef6',
          type: 0
        }
      ],
      message: 'Loaded successfully.',
      responseTime: '2019-11-08 21:17:45',
      result: 'Success',
      status: 200
    };
    const onSuccess = res => {
      if (res.result === 'Success') {
        this.setState({
          isFirstLoad: false,
          posts: res.data
        });
      }
    };

    // onSuccess(res);
    listPosts().then(onSuccess);
  }

  toggleModal = () => {
    console.log(this);
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
  };

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
