import React from 'react';
import bindAll from 'lodash.bindall';
import './index.scss';
import Header from '../../components/Talk/Header';
import { login } from '../../api/user';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isSubmit: false
    };

    bindAll(this, [
      'handleSubmit',
      'handleChangeUsername',
      'handleChangePassword',
      'handleKeyDown'
    ]);
  }

  handleChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    const { username, password } = this.state;
    if (!username || !password) return;

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        const { data } = res;
        // 保存 token 到 localStorage
        localStorage.setItem('token', JSON.stringify(data));
        this.props.history.push('/');
      }
    };

    this.setState({
      isSubmit: true
    });

    login({ username, password })
      .then(onSuccess)
      .finally(() => {
        this.setState({
          isSubmit: false
        });
      });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="auth-container">
        <Header></Header>
        <div className="form">
          <input
            type="text"
            placeholder="请输入账号"
            onChange={this.handleChangeUsername}
            onKeyDown={this.handleKeyDown}
          />
          <input
            type="password"
            placeholder="请输入密码"
            onChange={this.handleChangePassword}
            onKeyDown={this.handleKeyDown}
          />
          <button
            onClick={this.handleSubmit}
            disabled={!this.state.username || !this.state.password}
          >
            登录
          </button>
          <p style={{ opacity: this.state.isSubmit ? '1' : '0' }}>登录中...</p>
        </div>
      </div>
    );
  }
}

export default Auth;
