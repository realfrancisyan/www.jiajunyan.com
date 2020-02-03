import React from 'react';
import DiaryHeader from '../../components/Diary/Header';
import DiaryPosts from '../../components/Diary/Posts';
import UserMenuHOC from '../../hoc/UserMenu';
import Footer from '../../components/Footer';

class DiaryHome extends React.Component {
  constructor(props) {
    super(props);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  componentDidMount() {
    document.title = 'Diary - Jiajun Yan';
  }

  render() {
    return (
      <div className="box500">
        <DiaryHeader></DiaryHeader>
        <DiaryPosts ref={cd => (this.postsComponent = cd)}></DiaryPosts>
        <Footer></Footer>
      </div>
    );
  }
}

export default UserMenuHOC(DiaryHome);
