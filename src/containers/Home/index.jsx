import React from 'react';
import './index.scss';
import Header from '../../components/Header';
import Posts from '../../components/Posts';

class Home extends React.Component {
  render() {
    return (
      <div className="home-container">
        <Header></Header>
        <Posts></Posts>
      </div>
    );
  }
}

export default Home;
