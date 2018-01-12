import React from 'react';
import PropTypes from 'prop-types';
import {
  AutoComplete,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Subheader,
} from 'material-ui';
import HomeIcon from 'material-ui/svg-icons/action/home';
import ContactIcon from 'material-ui/svg-icons/action/feedback';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import RecentIcon from 'material-ui/svg-icons/action/date-range';
import TopRatedIcon from 'material-ui/svg-icons/action/thumb-up';
import MostViewedIcon from 'material-ui/svg-icons/image/remove-red-eye';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import TagIcon from 'material-ui/svg-icons/action/label-outline';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
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

    this.searchInput = null;
    this.state = {
      tags: [],
      searchTags: [],
      isLeftMenuOpen: false,
      isUploadDialogOpen: false,
      isSearchOpen: false,
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

  toggleSearchField = () => {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen,
    }, () => {
      this.searchInput.setState({
        searchText: '',
      });

      if (this.state.isSearchOpen) {
        this.searchInput.focus();
      }
    });
  }

  handleClick = (route) => {
    history.push(route);
    this.setState({ isLeftMenuOpen: false }, () => document.body.classList.toggle('modal-open'));
  }

  handleSearchFocus = () => {
    document.body.classList.add('disable-hotkeys');

    if (this.state.searchTags.length > 0) {
      return;
    }

    this.context.fetch(`/graphql?query=
    {
      getTags {
        name
      }
    }`).then(response => response.json()).then((data) => {
      const searchTags = data.data.getTags.map(tag => tag.name);

      this.setState({
        searchTags,
      });
    });
  }

  render() {
    return (
      <div>
        <Toolbar className={s.appBar}>
          <ToolbarGroup firstChild>
            <IconButton className={s.menuBtn} onTouchTap={this.toggleLeftMenu}>
              <MenuIcon />
            </IconButton>
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
            <ToolbarTitle text="Random Webm" className={s.appBarTitle} />
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <IconButton onTouchTap={this.toggleSearchField} disableTouchRipple>
              {this.state.isSearchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
            <AutoComplete
              id="appBarSearch"
              ref={(input) => {
                this.searchInput = input;
              }}
              className={s.searchInputWrapper}
              hintText="Search for tags"
              dataSource={this.state.searchTags}
              maxSearchResults={6}
              style={{
                width: this.state.isSearchOpen ? 256 : 0,
                opacity: +this.state.isSearchOpen,
                transition: 'all 0.2s ease-in-out',
              }}
              filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}
              onFocus={this.handleSearchFocus}
              onBlur={() => {
                document.body.classList.remove('disable-hotkeys');
              }}
              onNewRequest={(value) => {
                history.push(`/tag/${value.toLowerCase()}`);
                this.toggleSearchField();
              }}
            />
            <IconButton className={s.uploadBtn} onTouchTap={this.toggleUploadDialog}>
              <UploadIcon />
            </IconButton>
            <UploadDialog
              isUploadDialogOpen={this.state.isUploadDialogOpen}
              toggleUploadDialog={this.toggleUploadDialog}
            />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(s)(Header);
