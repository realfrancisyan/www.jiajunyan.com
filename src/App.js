import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Auth from './containers/Auth'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/auth" component={Auth} />
      </Switch>
    </div>
  );
}

export default App;
