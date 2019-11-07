import React from 'react';
import './index.scss';
import Header from '../../components/Header';
import Skeleton from '../../components/Skeleton';

class Home extends React.Component {
  state = {
    skeleton: []
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

  componentDidMount() {
    this.handleGetInnerHeight();
  }

  render() {
    return (
      <div className="home-container">
        <Header></Header>
        <div className="content">
          {this.state.skeleton.map((item, index) => (
            <Skeleton key={index}></Skeleton>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
