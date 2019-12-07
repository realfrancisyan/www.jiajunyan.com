import React from 'react';
import './index.scss';
import PlusIcon from '../../images/plus.png';

export default class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="simple-modal">
        {this.props.children}
        <div className="close-btn" onClick={this.props.handleCloseModal}>
          <img src={PlusIcon} alt="close" />
        </div>
      </div>
    );
  }
}
