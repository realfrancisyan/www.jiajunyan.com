import React from 'react';
import './index.scss';
import Skeleton from '../Skeleton';
import { listPosts, listPost } from '../../api/blog';
import moment from 'moment';
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

const PostContainer = props => {
  if (!props.isFirstLoad) {
    return (
      <div className="posts">
        {props.posts.map((item, index) => {
          return (
            <div className="post" key={index}>
              <div className="top">
                <h2>{item.title}</h2>
                <p>{moment(item.createdAt).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bottom">
                <ReactMarkdown source={item.body} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

class Posts extends React.Component {
  state = {
    isFirstLoad: true,
    skeleton: [],
    posts: []
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
    listPosts().then(res => {
      if (res.result === 'Success') {
        this.setState({
          isFirstLoad: false,
          posts: res.data
        });
      }
    });

    // listPost({ id: 'sgxWFK1568184120' }).then(res => {
    //   if (res.result === 'Success') {
    //     this.setState({
    //       isFirstLoad: false,
    //       posts: [res.data]
    //     });
    //   }
    // });
  }

  componentDidMount() {
    this.handleGetInnerHeight();
    this.handleGetList();
  }

  render() {
    return (
      <div className="posts-container">
        <SkeletonContainer
          isFirstLoad={this.state.isFirstLoad}
          skeleton={this.state.skeleton}
        ></SkeletonContainer>

        <PostContainer
          isFirstLoad={this.state.isFirstLoad}
          posts={this.state.posts}
        ></PostContainer>
      </div>
    );
  }
}

export default Posts;
