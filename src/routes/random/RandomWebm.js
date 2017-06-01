import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RandomWebm.css';

class RandomWebm extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.videoInput = null;
    this.state = {
      webm: null,
    };
  }

  componentDidMount = () => {
    this.getRandomWebm();
  }

  getRandomWebm = () => {
    this.context.fetch(`/graphql?query={
                                          randomWebm {
                                            id,
                                            originalName,
                                            source,
                                            hash,
                                            views,
                                            url,
                                            previewUrl,
                                            createdAt,
                                            updatedAt
                                          }
                                       }`,
    ).then(response => response.json()).then((data) => {
      this.setState({
        webm: data.data.randomWebm,
      }, () => {
        this.videoInput.load();
      });
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          {
            this.state.webm
              ?
                <div>
                  <video ref={(input) => { this.videoInput = input; }} src={this.state.webm.url} poster={this.state.webm.previewUrl} type="video/webm" controls autoPlay />
                  <div style={{ marginTop: 20 }}>
                    <RaisedButton label="Random Webm!" onTouchTap={this.getRandomWebm} primary />
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

export default withStyles(s)(RandomWebm);
