import React from 'react';
import ContentLoader from 'react-content-loader';

const Loader = props => (
  <ContentLoader
    height={props.skeletonSize.height}
    width={
      props.innerWidth < 768
        ? props.skeletonSize.minWidth
        : props.skeletonSize.maxWidth
    }
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="0" rx="3" ry="3" width="90" height="10" />
    <rect x="80" y="0" rx="3" ry="3" width="120" height="10" />
    <rect x="190" y="0" rx="3" ry="3" width="30" height="10" />
    <rect x="15" y="20" rx="3" ry="3" width="150" height="10" />
    <rect x="155" y="20" rx="3" ry="3" width="150" height="10" />
    <rect x="15" y="40" rx="3" ry="3" width="110" height="10" />
    <rect x="115" y="40" rx="3" ry="3" width="80" height="10" />
    <rect x="185" y="40" rx="3" ry="3" width="80" height="10" />
    <rect x="0" y="60" rx="3" ry="3" width="50" height="10" />
  </ContentLoader>
);

class Skeleton extends React.Component {
  state = {
    innerWidth: 0,
    skeletonSize: {
      minWidth: 310, // 骨架屏移动端宽度
      maxWidth: 400, // 骨架屏 PC 端宽度
      height: 100 // 骨架屏高度
    }
  };

  // 获取浏览器宽度，控制骨架屏宽度
  handleGetInnerWidth() {
    const handleSetInnerWidth = () => {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      });
    };
    handleSetInnerWidth();
    window.addEventListener('resize', handleSetInnerWidth);
  }

  componentDidMount() {
    this.handleGetInnerWidth();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="home-container box700 skeleton">
        <Loader
          innerWidth={this.state.innerWidth}
          skeletonSize={this.state.skeletonSize}
        ></Loader>
      </div>
    );
  }
}

export default Skeleton;
