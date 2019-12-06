import React from 'react';
import './index.scss';
import Logo from './images/logo.svg';

class DiaryHeader extends React.Component {
  render() {
    return (
      <header className="talk-header">
        <img src={Logo} alt="logo" />
      </header>
    );
  }
}

export default DiaryHeader;
