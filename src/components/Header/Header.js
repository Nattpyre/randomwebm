import React from 'react';
import AppBar from 'material-ui/AppBar';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';

class Header extends React.Component {
  render() {
    return (
      <AppBar />
    );
  }
}

export default withStyles(s)(Header);
