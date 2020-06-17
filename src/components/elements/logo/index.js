import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.less';

class Logo extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'PeerJS & React & Redux',
  };

  render() {
    const { title } = this.props;

    return <div className="logo">{title}</div>;
  }
}

export default Logo;
