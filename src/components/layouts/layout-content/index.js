import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Content } = Layout;
const style = {
  background: '#fafafa',
  padding: '30px 50px',
  height: 'calc(100vh - 132px)',
  overflow: 'hidden',
};

class LayoutContent extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return <Content style={style}>{children}</Content>;
  }
}

export default LayoutContent;
