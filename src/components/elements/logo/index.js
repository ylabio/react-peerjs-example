import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.less';

class Logo extends Component {
  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    to: '/',
    title: 'PeerJS & React & Redux',
  };

  render() {
    const { to, title } = this.props;

    return (
      <Link className="logo" to={to}>
        {title}
      </Link>
    );
  }
}

export default Logo;
