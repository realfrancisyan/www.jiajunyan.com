import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Auth from './containers/Auth';
import Talk from './containers/Talk';
import BlogPost from './containers/BlogPost';
import { connect } from 'react-redux';
import { ERROR_NOTIFY } from './common/actionTypes';

// redux 使用示例，待删除
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onAdd: payload => dispatch({ type: ERROR_NOTIFY, payload })
});

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/talk" component={Talk} />
          <Route path="/post/:id?" component={BlogPost} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
