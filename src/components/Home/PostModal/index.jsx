import React from 'react';
import './index.scss';
import PlusIcon from '../Posts/images/plus.png';
import bindAll from 'lodash.bindall';
import { createPost, getTags } from '../../../api/blog';
import openSocket from 'socket.io-client';
import { BASE_URL } from '../../../api/url';
import { clearCache } from '../../../api/cache';

const socket = openSocket.connect(BASE_URL);

const TagDropdown = props => {
  return (
    <select onChange={props.handleSelectTag} value={props.tag}>
      {props.tagList.map((tag, index) => {
        return (
          <option value={tag.type} key={index}>
            {tag.name}
          </option>
        );
      })}
    </select>
  );
};

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      tag: 0,
      isSubmit: false,
      tagList: []
    };

    bindAll(this, [
      'handleChangeTitle',
      'handleChangeContent',
      'handleSubmit',
      'handleToggleModal',
      'handleGetTags',
      'handleSelectTag'
    ]);
  }

  handleSelectTag(e) {
    this.setState({
      tag: e.target.value
    });
  }

  handleGetTags() {
    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        this.setState({
          tagList: res.data
        });
      }
    };
    getTags().then(onSuccess);
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
    const { title, content, tag } = this.state;
    if (!title || !content || tag === '') return;

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        // 刷新页面时，先删除缓存
        clearCache('/blog/public/getPosts');

        this.handleReset();
        this.handleToggleModal();
        this.handleGetList();
        this.handleSetNotification();
      }
    };

    this.setState({
      isSubmit: true
    });

    createPost({ title, content, type: tag })
      .then(onSuccess)
      .finally(() => {
        this.setState({
          isSubmit: false
        });
      });
  }

  handleSetNotification() {
    socket.emit('newBlogPost', {
      newBlogPost: true
    });
  }

  handleToggleModal() {
    if (typeof this.props.handleTogglePostModal === 'function') {
      this.props.handleTogglePostModal();
    }
  }

  // 刷新列表，从父组件调用
  handleGetList() {
    if (typeof this.props.handleGetList === 'function') {
      this.props.handleGetList();
    }
  }

  handleReset() {
    if (typeof this.props.handleReset === 'function') {
      this.props.handleReset();
    }
  }

  componentDidMount() {
    this.handleGetTags();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
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

          <TagDropdown
            tagList={this.state.tagList}
            tag={this.state.tag}
            handleSelectTag={this.handleSelectTag}
          ></TagDropdown>

          <button
            onClick={this.handleSubmit}
            disabled={!this.state.title || !this.state.content}
          >
            提交
          </button>
          <p style={{ opacity: this.state.isSubmit ? '1' : '0' }}>
            正在提交...
          </p>
        </div>

        <div className="close" onClick={this.handleToggleModal}>
          <img src={PlusIcon} alt="close button" />
        </div>
      </div>
    );
  }
}

export default PostModal;
