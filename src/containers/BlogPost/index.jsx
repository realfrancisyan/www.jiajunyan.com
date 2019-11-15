import React from 'react';
import './index.scss';
import Header from '../../components/Home/Header';
import Posts from '../../components/BlogPost';

class BlogPosts extends React.Component {
  render() {
    return (
      <div className="home-container box700">
        <Header></Header>
        <Posts></Posts>
      </div>
    );
  }
}

export default BlogPosts;
