import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

export default class Alert extends Component {
  render() {
    let { tip } = this.props;
    return <div className="loading-container">{tip}</div>;
  }
}

Alert.newInstance = function newNotificationInstance(properties) {
  let props = properties || {};
  let div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(React.createElement(Alert, props), div);
  return {
    destroy() {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    }
  };
};
