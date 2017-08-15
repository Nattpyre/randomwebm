import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, Paper } from 'material-ui';
import Linkify from 'linkifyjs/react';
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
          {
            this.state.webm
              ?
                <div className={s.webmWrapper}>
                  <video
                    ref={(input) => { this.videoInput = input; }}
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
                          Uploaded: {new Date(this.state.webm.createdAt).toLocaleString('en-US', { day: 'numeric', year: 'numeric', month: 'long' })}
                        </strong>
                        {
                          this.state.webm.source ?
                            <strong>Source: <Linkify options={{ target: { url: '_blank' } }}>{this.state.webm.source}</Linkify></strong>
                            :
                            null
                        }
                      </div>
                    </Paper>
                    <div className={s.webmRightBlock}>
                      <span className={s.webmViews}>{this.state.webm.views} views</span>
                      <RaisedButton className={s.webmBtn} label="Random Webm!" onTouchTap={this.getRandomWebm} primary />
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

export default withStyles(s)(RandomWebm);
