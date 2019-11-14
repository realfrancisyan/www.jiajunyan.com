import React from 'react';
import './index.scss';
import Header from '../../components/Talk/Header';
import Posts from '../../components/Talk/Posts';
import UserMenuHOC from '../../hoc/UserMenu';

class Home extends React.Component {
  constructor(props) {
    super(props);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  render() {
    return (
      <div className="box500">
        <Header></Header>
        <Posts ref={cd => (this.postsComponent = cd)}></Posts>
      </div>
    );
  }
}

export default UserMenuHOC(Home);
