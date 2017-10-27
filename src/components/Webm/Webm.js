import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, RaisedButton } from 'material-ui';
import LikeIcon from 'material-ui/svg-icons/action/thumb-up';
import DislikeIcon from 'material-ui/svg-icons/action/thumb-down';
import Linkify from 'linkifyjs/react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link';
import s from './Webm.css';

class Webm extends React.Component {

  static propTypes = {
    webm: PropTypes.shape({
      id: PropTypes.string.isRequired,
      source: PropTypes.string,
      views: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      dislikes: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })),
    }).isRequired,
    isRandom: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    isPopup: PropTypes.bool,
    getWebm: PropTypes.func,
  }

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { isLiked, isDisliked } = this.getWebmRating(this.props.webm.id);

    this.state = {
      webm: this.props.webm,
      isLiked,
      isDisliked,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isLiked, isDisliked } = this.getWebmRating(nextProps.webm.id);

    this.setState({
      webm: nextProps.webm,
      isLiked,
      isDisliked,
    });
  }

  getWebmRating = (id) => {
    const likedWebms = JSON.parse(localStorage.getItem('likedWebms')) || [];
    const dislikedWebms = JSON.parse(localStorage.getItem('dislikedWebms')) || [];

    let isLiked = false;

    if (likedWebms.indexOf(id) !== -1) {
      isLiked = true;
    }

    let isDisliked = false;

    if (dislikedWebms.indexOf(id) !== -1) {
      isDisliked = true;
    }

    return { isLiked, isDisliked };
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
      <div className={this.props.isPopup ? s.webmWrapperPopup : s.webmWrapper}>
        <div className={s.webmProportionsWrapper}>
          <video
            src={this.state.webm.url}
            type="video/webm"
            className={s.webm}
            controls
            autoPlay
          />
        </div>
        <div className={this.props.isPopup ? s.webmInfoWrapperPopup : s.webmInfoWrapper}>
          <div>
            <div className={s.webmInfo}>
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
          </div>
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
                  onTouchTap={() => this.props.getWebm()}
                  disabled={this.props.isLoading}
                  primary
                />
                :
                null
            }
          </div>
        </div>
      </div>
    );
  }
}

Webm.defaultProps = {
  isRandom: false,
  getWebm: null,
  isPopup: false,
};

export default withStyles(s)(Webm);
