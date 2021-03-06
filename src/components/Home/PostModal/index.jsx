import React from 'react';
import './index.scss';
import PlusIcon from '../Posts/images/plus.png';
import bindAll from 'lodash.bindall';
import {
  createPost,
  getTags,
  getSinglePost,
  editPost
} from '../../../api/blog';
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

    console.log(props);

    this.state = {
      title: '',
      content: '',
      tag: 0,
      isSubmit: false,
      tagList: [],
      isEditPost: props.isEditPost,
      postId: props.postId
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
    const { title, content, tag, postId, isEditPost } = this.state;
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

    const update = { title, content, type: tag };

    if (!isEditPost) {
      this.handleCreatePost(update, onSuccess);
    } else {
      update.id = postId;
      this.handleEditPost(update, onSuccess);
    }
  }

  handleCreatePost(update, onSuccess) {
    createPost(update)
      .then(onSuccess)
      .finally(() => {
        this.setState({
          isSubmit: false
        });
      });
  }

  handleEditPost(update, onSuccess) {
    editPost(update)
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

  // 获取修改文章内容
  handleGetSinglePost() {
    const { isEditPost, postId } = this.state;
    if (!isEditPost) return;

    const onSuccess = res => {
      if (res.message === 'SUCCESS') {
        const { title, body, type } = res.data;

        this.setState({
          title,
          content: body,
          tag: type
        });
      }
    };

    getSinglePost({ id: postId })
      .then(onSuccess)
      .catch(err => console.error('请求获取修改文章失败 - ', err));
  }

  handleReset() {
    if (typeof this.props.handleReset === 'function') {
      this.props.handleReset();
    }
  }

  componentDidMount() {
    this.handleGetTags();
    this.handleGetSinglePost();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="post-modal">
        <h2>{this.state.isEditPost ? '修改文章' : '新建文章'}</h2>
        <div className="post-form">
          <input
            type="text"
            placeholder="请输入标题"
            value={this.state.title}
            onChange={this.handleChangeTitle}
          />
          <textarea
            placeholder="请输入正文"
            cols="30"
            rows="10"
            value={this.state.content}
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
