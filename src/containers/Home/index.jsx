import React from 'react';
import './index.scss';
import Header from '../../components/Header';
import Posts from '../../components/Posts';
import bindAll from 'lodash.bindall';

const LogOutButton = props => {
  if (props.token) {
    return (
      <div className="logout">
        <button onClick={props.handleLogOut}>登出</button>
      </div>
    );
  }

  return null;
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    };
    bindAll(this, ['handleLogOut']);
    this.postsComponent = React.createRef();
  }

  handleGetToken() {
    const token = localStorage.getItem('token');
    this.setState({
      token
    });
  }

  handleLogOut() {
    localStorage.removeItem('token');
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
        ></LogOutButton>
      </div>
    );
  }
}

export default Home;
