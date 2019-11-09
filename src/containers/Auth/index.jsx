import React from 'react';
import './index.scss';
import Header from '../../components/Header';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="auth-container">
        <Header></Header>
        <div className="form">
          <input type="text" placeholder="username: " />
          <input type="password" placeholder="password: " />
          <button>登录</button>
          <p>登录中...</p>
        </div>
      </div>
    );
  }
}

export default Auth;
