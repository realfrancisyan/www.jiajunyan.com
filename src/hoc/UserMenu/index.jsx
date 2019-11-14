import React from 'react';
import './index.scss';
import bindAll from 'lodash.bindall';
import { parseToken } from '../../common';

const UserMenuHOC = WrappedComponent => {
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

  class UserMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        token: '',
        user: ''
      };
      bindAll(this, ['handleLogOut']);
      // 添加 ref 到 posts 子组件
      this.wrappedComponent = React.createRef();
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
      // 由于是 HOC，则需要找出嵌套的组件
      if (this.wrappedComponent.postsComponent.handleCheckToken) {
        this.wrappedComponent.postsComponent.handleCheckToken();
      }

      this.setState({
        token: ''
      });
    }

    componentDidMount() {
      this.handleGetToken();
    }

    render() {
      return (
        <div className="home-container box700">
          <LogOutButton
            handleLogOut={this.handleLogOut}
            token={this.state.token}
            user={this.state.user}
          ></LogOutButton>

          <WrappedComponent
            {...this.props}
            ref={cd => (this.wrappedComponent = cd)}
          ></WrappedComponent>
        </div>
      );
    }
  }

  return UserMenu;
};

export default UserMenuHOC;
