import React from 'react';
import './index.scss';
import Header from '../../components/Home/Header';
import Posts from '../../components/Home/BlogPost';
import Footer from '../../components/Home/Footer';

class BlogPosts extends React.Component {
  render() {
    return (
      <div className="home-container box700">
        <Header></Header>
        <Posts></Posts>
        <Footer></Footer>
      </div>
    );
  }
}

export default BlogPosts;
