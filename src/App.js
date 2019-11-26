import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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

const BaiduAnalyze = props => {
  let children = props.children;
  // eslint-disable-next-line
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?dc52a22618aa1d7ef655e38dbec28daf';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
  })();
  return children;
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <BaiduAnalyze>
            <Route exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <Route path="/talk" component={Talk} />
            <Route path="/post/:id?" component={BlogPost} />
            <Redirect to="/" />
          </BaiduAnalyze>
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
