import React from 'react';
import './index.scss';
import bindAll from 'lodash.bindall';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, ['handleRouteToHomePage']);
  }
  // 返回首页
  handleRouteToHomePage() {
    this.props.history.push('/');
  }

  render() {
    return (
      <footer>
        <div className="footer">
          <h2 onClick={this.handleRouteToHomePage}>Jiajun Yan</h2>
          <div className="block">
            <h3>社交网络</h3>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/yanjiajun"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/realfrancisyan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/jiajun.yan.travel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className="block">
            <h3>其他内容</h3>
            <ul>
              <li>
                <Link to="/talk">Talk</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="record">
          <a
            href="http://www.beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            粤ICP备19153485号
          </a>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
