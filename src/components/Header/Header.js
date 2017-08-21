import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Divider, Drawer, IconButton, MenuItem, Subheader } from 'material-ui';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import history from '../../history';
import UploadDialog from '../UploadDialog';

class Header extends React.Component {

  static contextTypes = {
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      isLeftMenuOpen: false,
      isUploadDialogOpen: false,
    };
  }

  componentDidMount = () => {
    this.context.fetch(`/graphql?query=
    {
      getTags(limit: 5) {
        id,
        name
      }
    }`).then(response => response.json()).then((data) => {
      this.setState({
        tags: data.data.getTags,
      });
    });
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

  handleClick = (route) => {
    history.push(route);
    this.setState({ isLeftMenuOpen: false });
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
          <Subheader>Pages</Subheader>
          <MenuItem onTouchTap={() => this.handleClick('/random')}>
            Home
          </MenuItem>
          <MenuItem onTouchTap={() => this.handleClick('/contacts')}>
            Contacts
          </MenuItem>
          <Divider />
          <Subheader>Top tags</Subheader>
          {
            this.state.tags.length > 0 ?
              <div>
                {
                  this.state.tags.map(tag => (
                    <MenuItem key={tag.id} onTouchTap={() => this.handleClick(`/tag/${tag.name.toLowerCase()}`)}>
                      {tag.name}
                    </MenuItem>
                  ))
                }
              </div>
              :
              null
          }
        </Drawer>
        <UploadDialog
          isUploadDialogOpen={this.state.isUploadDialogOpen}
          toggleUploadDialog={this.toggleUploadDialog}
        />
      </div>
    );
  }
}

export default withStyles(s)(Header);
