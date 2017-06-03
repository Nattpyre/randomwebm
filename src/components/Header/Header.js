import React from 'react';
import { AppBar, Drawer, IconButton, MenuItem } from 'material-ui';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import history from '../../history';
import UploadDialog from '../UploadDialog';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLeftMenuOpen: false,
      isUploadDialogOpen: false,
    };
  }

  toggleLeftMenu = () => {
    this.setState({
      isLeftMenuOpen: !this.state.isLeftMenuOpen,
    });
  }

  toggleUploadDialog = () => {
    this.setState({
      isUploadDialogOpen: !this.state.isUploadDialogOpen,
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Random Webm"
          onLeftIconButtonTouchTap={this.toggleLeftMenu}
          iconElementRight={
            <IconButton onTouchTap={this.toggleUploadDialog}>
              <UploadIcon />
            </IconButton>
          }
        />
        <Drawer
          docked={false}
          open={this.state.isLeftMenuOpen}
          onRequestChange={this.toggleLeftMenu}
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
        <UploadDialog isUploadDialogOpen={this.state.isUploadDialogOpen} toggleUploadDialog={this.toggleUploadDialog} />
      </div>
    );
  }
}

export default withStyles(s)(Header);
