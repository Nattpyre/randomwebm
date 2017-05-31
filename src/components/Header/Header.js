import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import history from '../../history';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLeftMenuOpen: false,
    };
  }

  toggleLeftMenu = () => {
    this.setState({
      isLeftMenuOpen: !this.isLeftMenuOpen,
    });
  }

  render() {
    return (
      <div>
        <AppBar title="Random Webm" onLeftIconButtonTouchTap={this.toggleLeftMenu} />
        <Drawer
          docked={false}
          open={this.state.isLeftMenuOpen}
          onRequestChange={open => this.setState({ isLeftMenuOpen: open })}
        >
          <MenuItem
            onTouchTap={() => {
              history.push('/random');
              this.setState({ isLeftMenuOpen: false });
            }}
          >
            Random Webm
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(s)(Header);
