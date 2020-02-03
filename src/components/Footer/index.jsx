import React from 'react';
import bindAll from 'lodash.bindall';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import BeiAnIcon from './images/beian.png';
import './index.scss';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blocks: [
        {
          name: '社交网络',
          list: [
            { href: 'https://www.linkedin.com/in/yanjiajun', name: 'LinkedIn' },
            { href: 'https://github.com/realfrancisyan', name: 'Github' },
            {
              href: 'https://instagram.com/jiajun.yan.travel',
              name: 'Instagram'
            }
          ]
        },
        {
          name: '其他内容',
          list: [{ href: '/talk', name: 'Talk' }]
        }
      ]
    };

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
          {this.state.blocks.map(block => {
            return (
              <div className="block">
                <h3>{block.name}</h3>
                <ul>
                  {block.list.map(item => {
                    return (
                      <li>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="copy-right">
          © 2017-{moment().format('YYYY')} Jiajun Yan. All rights reserved.
        </div>
        <div className="record">
          <a
            href="http://www.beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            粤 ICP 备 19153485 号
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.beian.gov.cn"
          >
            <img src={BeiAnIcon} alt="bei an" />
            粤公网安备 44010502001478 号
          </a>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
