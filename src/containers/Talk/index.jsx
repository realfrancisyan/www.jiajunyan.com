import React from 'react';
import TalkHeader from '../../components/Talk/Header';
import TalkPosts from '../../components/Talk/Posts';
import UserMenuHOC from '../../hoc/UserMenu';
import Footer from '../../components/Home/Footer';

class TalkHome extends React.Component {
  constructor(props) {
    super(props);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  componentDidMount() {
    document.title = 'Talk - Jiajun Yan';
  }

  render() {
    return (
      <div className="box500-talk">
        <TalkHeader></TalkHeader>
        <TalkPosts ref={cd => (this.postsComponent = cd)}></TalkPosts>
        <Footer></Footer>
      </div>
    );
  }
}

export default UserMenuHOC(TalkHome);
