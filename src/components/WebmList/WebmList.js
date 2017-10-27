import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, GridTile, MenuItem, SelectField, IconButton } from 'material-ui';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import Progress from 'material-ui/CircularProgress';
import ViewsIcon from 'material-ui/svg-icons/image/remove-red-eye';
import LikeIcon from 'material-ui/svg-icons/action/thumb-up';
import DislikeIcon from 'material-ui/svg-icons/action/thumb-down';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
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
    this.state = {
      webms: [],
      order: this.props.order,
      pageSize: 24,
      page: 1,
      hasMore: false,
      isLoading: false,
      selectedWebm: null,
    };
  }

  componentDidMount = () => {
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

  getWebmList = (tagName) => {
    this.setState({
      isLoading: true,
    });

    const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];

    if (this.props.isFavorite && likedWebms.length === 0) {
      this.setState({
        isLoading: false,
      });

      return;
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
      });
    });
  }

  handleOrderChange = (e, index, value) => {
    this.setState({
      webms: [],
      page: 1,
      hasMore: true,
      order: value,
    }, () => {
      this.getWebmList(this.props.title);
    });
  }

  handleWebmClick = (e, id) => {
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
    }`).then(response => response.json()).then((data) => {
      this.setState({
        selectedWebm: data.data.getWebm,
      });
    });

    e.preventDefault();
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
                  onChange={this.handleOrderChange}
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
                      <div key={webm.id} className={s.webmItemWrapper}>
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
                            href={`/webm/${webm.id}`}
                            className={s.previewWrapper}
                            onClick={e => this.handleWebmClick(e, webm.id)}
                          >
                            <img src={webm.previewUrl} alt={webm.originalName} />
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
                      bodyClassName={s.selectedWebmWrapper}
                    >
                      <Webm
                        webm={this.state.selectedWebm}
                        isRandom={false}
                        isLoading={this.state.isLoading}
                        isPopup
                      />
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
