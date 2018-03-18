import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Webm from '../Webm';
import s from './WebmPage.css';

class WebmPage extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    isRandom: PropTypes.bool,
  }

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      webm: null,
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
      this.setState({
        webm: data.data.getWebm,
        isLoading: false,
      }, () => {
        if (!id && lastViewed.length >= 10) {
          lastViewed.splice(0, 1);
        }

        if (!id && this.state.webm) {
          lastViewed.push(this.state.webm.id);
          localStorage.setItem('lastViewed', JSON.stringify(lastViewed));
        }
      });
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {
            this.state.webm ?
              <Webm
                webm={this.state.webm}
                isRandom={this.props.isRandom}
                isLoading={this.state.isLoading}
                getWebm={this.getWebm}
              />
              :
              null
          }
        </div>
      </div>
    );
  }
}

WebmPage.defaultProps = {
  id: null,
  isRandom: false,
};

export default withStyles(s)(WebmPage);
