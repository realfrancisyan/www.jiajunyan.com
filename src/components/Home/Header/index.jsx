import React from 'react';
import './index.scss';
import bindAll from 'lodash.bindall';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, ['handleRouteToHomePage']);
  }

  // 返回首页
  handleRouteToHomePage() {
    this.props.history.push('/');
  }

  render() {
    return (
      <header
        className={`home-header ${this.props.type === 'home' ? 'home' : ''}`}
      >
        <h1 onClick={this.handleRouteToHomePage}>Jiajun Yan</h1>
      </header>
    );
  }
}

export default withRouter(Header);
