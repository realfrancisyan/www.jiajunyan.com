import React from 'react';
import Header from '../../components/Home/Header';
import Posts from '../../components/Home/Posts';
import Footer from '../../components/Footer';
import UserMenuHOC from '../../hoc/UserMenu';

class Home extends React.Component {
  constructor(props) {
    super(props);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  componentDidMount() {
    document.title = 'Jiajun Yan';
  }

  render() {
    return (
      <div className="home-container box900">
        <Header type="home"></Header>
        <Posts ref={cd => (this.postsComponent = cd)}></Posts>
        <Footer></Footer>
      </div>
    );
  }
}

export default UserMenuHOC(Home);
