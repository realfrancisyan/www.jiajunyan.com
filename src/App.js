import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Auth from './containers/Auth';
import { connect } from 'react-redux';
import { ERROR_NOTIFY } from './common/actionTypes';

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onAdd: payload => dispatch({ type: ERROR_NOTIFY, payload })
});

class App extends React.Component {
  componentDidMount() {
    this.props.onAdd(true);
  }
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/auth" component={Auth} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
