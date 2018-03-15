import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, GridTile, MenuItem, SelectField, IconButton } from 'material-ui';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import Progress from 'material-ui/CircularProgress';
import ViewsIcon from 'material-ui/svg-icons/image/remove-red-eye';
import LikeIcon from 'material-ui/svg-icons/action/thumb-up';
import DislikeIcon from 'material-ui/svg-icons/action/thumb-down';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Webm from '../Webm';
import s from './WebmList.css';

class WebmList extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    withoutTag: PropTypes.bool,
    isFavorite: PropTypes.bool,
    order: PropTypes.oneOf([
      'createdAt',
      'likes',
      'views',
    ]),
  }

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.isAdmin = false;
    this.state = {
      webms: [],
      order: this.props.order,
      pageSize: 24,
      page: 1,
      hasMore: false,
      isLoading: false,
      selectedWebm: null,
      hasPreviousWebm: false,
      hasNextWebm: false,
    };
  }

  componentDidMount = () => {
    if (typeof window !== 'undefined' && window.App.user && window.App.user.roles.indexOf('administrator')) {
      this.isAdmin = true;
    }

    this.getWebmList(this.props.title);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      webms: [],
      page: 1,
      hasMore: false,
      order: nextProps.order,
      selectedWebm: null,
    }, () => {
      this.getWebmList(nextProps.title);
    });
  }

  getWebmList = async tagName => new Promise((resolve, reject) => {
    this.setState({
      isLoading: true,
    });

    const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];

    if (this.props.isFavorite && likedWebms.length === 0) {
      this.setState({
        isLoading: false,
      });

      return reject();
    }

    this.context.fetch(`/graphql?query={
      getWebmList(
        tagName: ${this.props.withoutTag || this.props.isFavorite ? null : `"${tagName.toLowerCase()}"`},
        order: ${this.state.order},
        pageSize: ${this.state.pageSize},
        page: ${this.state.page},
        likedWebms: ${JSON.stringify(this.props.isFavorite ? likedWebms : [])}
      ) {
        id,
        originalName,
        views,
        previewUrl,
        likes,
        dislikes,
        createdAt,
      }
    }`).then(response => response.json()).then((data) => {
      this.setState({
        page: this.state.page + 1,
        webms: this.state.webms.concat(data.data.getWebmList),
        hasMore: data.data.getWebmList.length > 0,
        isLoading: false,
      }, () => {
        resolve(data.data.getWebmList);
      });
    });
  })

  handleOrderChange = (value) => {
    this.setState({
      webms: [],
      page: 1,
      hasMore: true,
      order: value,
    }, () => {
      this.getWebmList(this.props.title);
    });
  }

  selectWebm = (id) => {
    this.context.fetch(`/graphql?query={
      getWebm(id: "${id}") {
        id,
        source,
        views,
        url,
        likes,
        dislikes,
        createdAt,
        tags {
          id,
          name
        }
      }
    }`).then(response => response.json()).then(async (data) => {
      let hasPreviousWebm = false;
      let hasNextWebm = false;

      await Promise.all(this.state.webms.map(async (item, index) => {
        if (item.id === data.data.getWebm.id && index !== 0) {
          hasPreviousWebm = true;
        }

        if (item.id === data.data.getWebm.id && index < this.state.webms.length - 1) {
          hasNextWebm = true;
        } else if (item.id === data.data.getWebm.id && index === this.state.webms.length - 1) {
          hasNextWebm = await this.getWebmList(this.props.title).then(webms => webms.length > 0);
        }
      }));

      this.setState({
        selectedWebm: data.data.getWebm,
        hasPreviousWebm,
        hasNextWebm,
      });
    });
  }

  selectPreviousWebm = () => {
    this.state.webms.forEach((item, index) => {
      if (item.id === this.state.selectedWebm.id) {
        this.selectWebm(this.state.webms[index - 1].id);
      }
    });
  }

  selectNextWebm = () => {
    this.state.webms.forEach((item, index) => {
      if (item.id === this.state.selectedWebm.id) {
        this.selectWebm(this.state.webms[index + 1].id);
      }
    });
  }

  closeWebmModal = () => {
    this.setState({
      selectedWebm: null,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.listHeader}>
            {
              this.props.title ?
                <h1>{this.props.title}</h1>
                :
                null
            }
            {
              this.props.withoutTag ?
                null
                :
                <SelectField
                  value={this.state.order}
                  id="list-order"
                  className={s.listOrder}
                  onChange={(e, key, value) => this.handleOrderChange(value)}
                  floatingLabelText="Order By"
                >
                  <MenuItem
                    key={1}
                    value="createdAt"
                    primaryText="Newest"
                  />
                  <MenuItem key={2} value="likes" primaryText="Top Rated" />
                  <MenuItem key={3} value="views" primaryText="Most Viewed" />
                </SelectField>
            }
          </div>
          {
            this.state.webms.length > 0 || this.state.isLoading ?
              <div>
                <InfiniteScroll
                  className={s.webmInfiniteScroll}
                  loadMore={() => this.getWebmList(this.props.title)}
                  hasMore={!this.state.isLoading && this.state.hasMore}
                  threshold={1}
                  loader={this.state.isLoading ? <Progress className={s.loader} /> : null}
                  initialLoad={false}
                >
                  {
                    this.state.webms.map(webm => (
                      <div key={webm.id} className={s.webmItemWrapper} data-loaded={false}>
                        <GridTile
                          className={s.webmItem}
                          title={
                            <div className={s.webmTitle}>
                              <div>
                                <DateIcon color="#fff" />
                                <span>
                                  {webm.createdAt}
                                </span>
                              </div>
                              <div className={s.webmRating}>
                                <div>
                                  <LikeIcon color="#fff" />
                                  <span>{webm.likes}</span>
                                </div>
                                <div>
                                  <DislikeIcon color="#fff" />
                                  <span>{webm.dislikes}</span>
                                </div>
                              </div>
                            </div>
                          }
                          subtitle={
                            <span className={s.webmSubtitle}>
                              <ViewsIcon color="#fff" />
                              {webm.views} views
                          </span>
                          }
                        >
                          <a
                            href={`${this.isAdmin ? '/admin' : ''}/webm/${webm.id}`}
                            className={s.previewWrapper}
                            onClick={(e) => {
                              this.selectWebm(webm.id);
                              e.preventDefault();
                            }}
                          >
                            <img
                              src={webm.previewUrl}
                              alt={webm.originalName}
                              onLoad={(e) => {
                                e.target.closest('[data-loaded="false"]').setAttribute('data-loaded', 'true');
                              }}
                            />
                          </a>
                        </GridTile>
                      </div>
                    ))
                  }
                </InfiniteScroll>
                {
                  this.state.selectedWebm ?
                    <Dialog
                      open={!!this.state.selectedWebm}
                      title={
                        <div className={s.closeButtonWrapper}>
                          <IconButton className={s.closeButton} onTouchTap={this.closeWebmModal}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      }
                      onRequestClose={this.closeWebmModal}
                      contentClassName={s.dialog}
                      bodyClassName={s.selectedWebmWrapper}
                      overlayClassName={s.modalOverlay}
                    >
                      {
                        this.state.hasPreviousWebm ?
                          <IconButton
                            className={s.navigationArrow}
                            onTouchTap={this.selectPreviousWebm}
                          >
                            <IconLeft />
                          </IconButton>
                          :
                          null
                      }
                      <Webm
                        webm={this.state.selectedWebm}
                        isRandom={false}
                        isLoading={this.state.isLoading}
                        isPopup
                      />
                      {
                        this.state.hasNextWebm ?
                          <IconButton
                            className={`${s.navigationArrow} ${s.navigationArrowRight}`}
                            onTouchTap={this.selectNextWebm}
                          >
                            <IconRight />
                          </IconButton>
                          :
                          null
                      }
                    </Dialog>
                    :
                    null
                }
              </div>
              :
              <p>No results found.</p>
          }
        </div>
      </div>
    );
  }
}

WebmList.defaultProps = {
  title: 'Recent Webms',
  withoutTag: false,
  isFavorite: false,
  order: 'createdAt',
};

export default withStyles(s)(WebmList);
