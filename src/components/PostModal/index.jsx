import React from 'react';
import './index.scss';
import PlusIcon from '../Posts/images/plus.png';
import bindAll from 'lodash.bindall';

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    };

    bindAll(this, [
      'handleChangeTitle',
      'handleChangeContent',
      'handleSubmit',
      'handleToggleModal'
    ]);
  }

  handleChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleChangeContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleSubmit() {
    const { title, content } = this.state;
    console.log(title, content);
  }

  handleToggleModal() {
    if (typeof this.props.handleTogglePostModal === 'function') {
      this.props.handleTogglePostModal();
    }
  }

  render() {
    return (
      <div className="post-modal">
        <h2>新建文章</h2>
        <div className="post-form">
          <input
            type="text"
            placeholder="请输入标题"
            onChange={this.handleChangeTitle}
          />
          <textarea
            placeholder="请输入正文"
            cols="30"
            rows="10"
            onChange={this.handleChangeContent}
          ></textarea>
          <button
            onClick={this.handleSubmit}
            disabled={!this.state.title || !this.state.content}
          >
            提交
          </button>
          <p>正在提交...</p>
        </div>

        <div className="close" onClick={this.handleToggleModal}>
          <img src={PlusIcon} alt="close button" />
        </div>
      </div>
    );
  }
}

export default PostModal;
