import React from 'react';
import './index.scss';
import Header from '../../components/Home/Header';
import Posts from '../../components/Home/Posts';
import UserMenuHOC from '../../hoc/UserMenu';

class Home extends React.Component {
  constructor(props) {
    super(props);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  render() {
    return (
      <div className="home-container box700">
        <Header></Header>
        <Posts ref={cd => (this.postsComponent = cd)}></Posts>
      </div>
    );
  }
}

export default UserMenuHOC(Home);
