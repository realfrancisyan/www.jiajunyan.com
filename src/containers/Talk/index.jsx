import React from 'react';
import './index.scss';
import Header from '../../components/Talk/Header';
import Posts from '../../components/Talk/Posts';
import bindAll from 'lodash.bindall';
import { parseToken } from '../../common';

const LogOutButton = props => {
  if (props.token) {
    return (
      <div className="logout">
        <p>欢迎你，{props.user.name}</p>
        <button onClick={props.handleLogOut}>登出</button>
      </div>
    );
  }

  return null;
};

class Talk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user: ''
    };
    bindAll(this, ['handleLogOut']);
    // 添加 ref 到 posts 子组件
    this.postsComponent = React.createRef();
  }

  handleGetToken() {
    const { token, user } = parseToken();
    this.setState({
      token,
      user
    });
  }

  handleLogOut() {
    localStorage.removeItem('token');
    // 登出后，调用子组件，刷新 token，移除编辑态
    this.postsComponent.handleCheckToken();
    this.setState({
      token: ''
    });
  }

  componentDidMount() {
    this.handleGetToken();
  }

  render() {
    return (
      <div className="home-container">
        <Header></Header>
        <Posts ref={cd => (this.postsComponent = cd)}></Posts>
        <LogOutButton
          handleLogOut={this.handleLogOut}
          token={this.state.token}
          user={this.state.user}
        ></LogOutButton>
      </div>
    );
  }
}

export default Talk;
