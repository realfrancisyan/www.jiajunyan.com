import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, HashRouter } from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  </HashRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// 设置字体大小基准
const handleSetFontSize = () => {
  const oHtml = document.getElementsByTagName('html')[0];
  const width = oHtml.clientWidth;
  // 320px的屏幕基准像素为12px
  oHtml.style.fontSize =
    window.innerWidth <= 768 ? `${12 * (width / 320)}px` : '16px';
};

handleSetFontSize();
window.addEventListener('resize', handleSetFontSize);
