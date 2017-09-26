import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, RaisedButton, Paper } from 'material-ui';
import LikeIcon from 'material-ui/svg-icons/action/thumb-up';
import DislikeIcon from 'material-ui/svg-icons/action/thumb-down';
import Linkify from 'linkifyjs/react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Webm.css';

class Webm extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    isRandom: PropTypes.bool,
  }

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.videoInput = null;
    this.state = {
      webm: null,
      isLiked: false,
      isDisliked: false,
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.getWebm(this.props.id);
  }

  componentWillReceiveProps = (nextProps) => {
    this.getWebm(nextProps.id);
  }

  getWebm = (id) => {
    const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];
    const dislikedWebms = JSON.parse(localStorage.getItem('dislikedWebms')) || [];
    const lastViewed = JSON.parse(localStorage.getItem('lastViewed')) || [];

    this.setState({
      isLoading: true,
    });

    const excludedIds = lastViewed.concat(dislikedWebms);

    this.context.fetch(`/graphql?query=
    {
      getWebm(
        id: ${id ? `"${id}"` : null},
        excludedIds: ${JSON.stringify(Array.from(new Set(excludedIds)))}
        ) {
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
    }`,
    ).then(response => response.json()).then((data) => {
      let isLiked = false;

      if (likedWebms.indexOf(data.data.getWebm.id) !== -1) {
        isLiked = true;
      }

      let isDisliked = false;

      if (dislikedWebms.indexOf(data.data.getWebm.id) !== -1) {
        isDisliked = true;
      }

      this.setState({
        webm: data.data.getWebm,
        isLoading: false,
        isLiked,
        isDisliked,
      }, () => {
        if (!id && lastViewed.length >= 10) {
          lastViewed.splice(0, 1);
        }

        if (!id) {
          lastViewed.push(this.state.webm.id);
          localStorage.setItem('lastViewed', JSON.stringify(lastViewed));
        }

        this.videoInput.load();
      });
    });
  }

  toggleLike = () => {
    const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];
    const index = likedWebms.indexOf(this.state.webm.id);
    const isLiked = this.state.isLiked;
    const isDisliked = this.state.isDisliked;

    if (isLiked && index !== -1) {
      likedWebms.splice(index, 1);
    } else {
      likedWebms.push(this.state.webm.id);
    }

    localStorage.setItem('likedWebms', JSON.stringify(likedWebms));

    const webmState = { ...this.state.webm };

    webmState.likes = isLiked ? webmState.likes - 1 : webmState.likes + 1;

    if (isDisliked) {
      webmState.dislikes -= 1;
    }

    this.setState({
      webm: webmState,
      isLiked: !isLiked,
      isDisliked: false,
    });

    this.context.fetch(`/graphql?query=
      mutation {
        toggleLike(
          id: "${webmState.id}",
          hasLike: ${isLiked},
          hasDislike: ${isDisliked}
        ) {
          id
        }
    }`).then(() => {
      const dislikedWebms = JSON.parse(localStorage.getItem('dislikedWebms')) || [];
      const webmIndex = dislikedWebms.indexOf(webmState.id);

      if (isDisliked && webmIndex !== -1) {
        dislikedWebms.splice(webmIndex, 1);
      }

      localStorage.setItem('dislikedWebms', JSON.stringify(dislikedWebms));
    });
  }

  toggleDislike = () => {
    const dislikedWebms = JSON.parse(localStorage.getItem('dislikedWebms')) || [];
    const index = dislikedWebms.indexOf(this.state.webm.id);
    const isLiked = this.state.isLiked;
    const isDisliked = this.state.isDisliked;

    if (isDisliked && index !== -1) {
      dislikedWebms.splice(index, 1);
    } else {
      dislikedWebms.push(this.state.webm.id);
    }

    localStorage.setItem('dislikedWebms', JSON.stringify(dislikedWebms));

    const webmState = { ...this.state.webm };

    webmState.dislikes = isDisliked ? webmState.dislikes - 1 : webmState.dislikes + 1;

    if (this.state.isLiked) {
      webmState.likes -= 1;
    }

    this.setState({
      webm: webmState,
      isLiked: false,
      isDisliked: !isDisliked,
    });

    this.context.fetch(`/graphql?query=
      mutation {
        toggleDislike(
          id: "${webmState.id}",
          hasLike: ${isLiked},
          hasDislike: ${isDisliked}
        ) {
          id
        }
    }`).then(() => {
      const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];
      const webmIndex = likedWebms.indexOf(webmState.id);

      if (isLiked && webmIndex !== -1) {
        likedWebms.splice(webmIndex, 1);
      }

      localStorage.setItem('likedWebms', JSON.stringify(likedWebms));
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {
            this.state.webm ?
              <div className={s.webmWrapper}>
                <video
                  ref={(input) => {
                    this.videoInput = input;
                  }}
                  src={this.state.webm.url}
                  type="video/webm"
                  className={s.webm}
                  controls
                  autoPlay
                />
                <div className={s.webmInfoWrapper}>
                  <Paper className={s.webmInfo} rounded={false}>
                    <div className={s.webmInfoHeader}><strong>Information</strong></div>
                    <div className={s.webmInfoBody}>
                      <strong>
                        Uploaded: {this.state.webm.createdAt}
                      </strong>
                      {
                        this.state.webm.source ?
                          <strong>
                            Source: <Linkify options={{ target: { url: '_blank' } }}>{this.state.webm.source}</Linkify>
                          </strong>
                          :
                          null
                      }
                      {
                        this.state.webm.tags.length > 0 ?
                          <div>
                            <strong>Tags: </strong>
                            <div className={s.tagsWrapper}>
                              {
                                this.state.webm.tags.map(tag => (
                                  <Link key={tag.id} to={`/tag/${tag.name.toLowerCase()}`} className={s.tagItem}>
                                    {tag.name}
                                  </Link>
                                ))
                              }
                            </div>
                          </div>
                          :
                          null
                      }
                    </div>
                  </Paper>
                  <div className={s.webmRightBlock}>
                    <span className={s.webmViews}>{this.state.webm.views} views</span>
                    <div className={s.webmRatingWrapper}>
                      <div
                        className={
                          this.state.isLiked ? s.ratingBtnWrapperActive : s.ratingBtnWrapper
                        }
                      >
                        <IconButton
                          className={s.ratingBtn}
                          onTouchTap={this.toggleLike}
                        >
                          <LikeIcon color={this.state.isLiked ? '#000000' : '#767676'} hoverColor="#000000" />
                        </IconButton>
                        <span>{this.state.webm.likes}</span>
                      </div>
                      <div
                        className={
                          this.state.isDisliked ? s.ratingBtnWrapperActive : s.ratingBtnWrapper
                        }
                      >
                        <IconButton
                          className={s.ratingBtn}
                          onTouchTap={this.toggleDislike}
                        >
                          <DislikeIcon color={this.state.isDisliked ? '#000000' : '#767676'} hoverColor="#000000" />
                        </IconButton>
                        <span>{this.state.webm.dislikes}</span>
                      </div>
                    </div>
                    {
                      this.props.isRandom ?
                        <RaisedButton
                          className={s.webmBtn}
                          label="Random Webm"
                          onTouchTap={() => this.getWebm()}
                          disabled={this.state.isLoading}
                          primary
                        />
                        :
                        null
                    }
                  </div>
                </div>
              </div>
              :
              null
          }
        </div>
      </div>
    );
  }
}

Webm.defaultProps = {
  id: null,
  isRandom: false,
};

export default withStyles(s)(Webm);
