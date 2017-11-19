import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Divider, Drawer, IconButton, MenuItem, Subheader } from 'material-ui';
import HomeIcon from 'material-ui/svg-icons/action/home';
import ContactIcon from 'material-ui/svg-icons/action/feedback';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import RecentIcon from 'material-ui/svg-icons/action/date-range';
import TopRatedIcon from 'material-ui/svg-icons/action/thumb-up';
import MostViewedIcon from 'material-ui/svg-icons/image/remove-red-eye';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import TagIcon from 'material-ui/svg-icons/action/label-outline';
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
    }, () => {
      document.body.classList.toggle('modal-open');
    });
  }

  toggleUploadDialog = () => {
    this.setState({
      isUploadDialogOpen: !this.state.isUploadDialogOpen,
    }, () => {
      document.body.classList.toggle('modal-open');
    });
  }

  handleClick = (route) => {
    history.push(route);
    this.setState({ isLeftMenuOpen: false }, () => document.body.classList.toggle('modal-open'));
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
          overlayClassName={s.modalOverlay}
        >
          <Subheader>Pages</Subheader>
          <MenuItem leftIcon={<HomeIcon />} onTouchTap={() => this.handleClick('/random')}>
            Home
          </MenuItem>
          <MenuItem leftIcon={<ContactIcon />} onTouchTap={() => this.handleClick('/about')}>
            About Us
          </MenuItem>
          <Divider />
          <Subheader>Webms</Subheader>
          <MenuItem leftIcon={<RecentIcon />} onTouchTap={() => this.handleClick('/recent')}>
            Recent
          </MenuItem>
          <MenuItem leftIcon={<TopRatedIcon />} onTouchTap={() => this.handleClick('/top')}>
            Top Rated
          </MenuItem>
          <MenuItem leftIcon={<MostViewedIcon />} onTouchTap={() => this.handleClick('/popular')}>
            Most Viewed
          </MenuItem>
          <MenuItem leftIcon={<FavoriteIcon />} onTouchTap={() => this.handleClick('/favorite')}>
            Favorite
          </MenuItem>
          <Divider />
          <Subheader>Top tags</Subheader>
          {
            this.state.tags.length > 0 ?
              <div>
                {
                  this.state.tags.map(tag => (
                    <MenuItem
                      key={tag.id}
                      leftIcon={<TagIcon />}
                      onTouchTap={() => this.handleClick(`/tag/${tag.name.toLowerCase()}`)}
                    >
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
