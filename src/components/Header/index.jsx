import React from 'react';
import './index.scss';
import Logo from './images/logo.svg';

class Header extends React.Component {
  render() {
    return (
      <header>
        <img src={Logo} alt="logo" />
      </header>
    );
  }
}

export default Header;
