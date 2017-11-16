import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Slider, LinearProgress, CircularProgress } from 'material-ui';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import EnterFullScreenIcon from 'material-ui/svg-icons/navigation/fullscreen';
import ExitFullScreenIcon from 'material-ui/svg-icons/navigation/fullscreen-exit';
import VolumeUpIcon from 'material-ui/svg-icons/av/volume-up';
import VolumeDownIcon from 'material-ui/svg-icons/av/volume-down';
import VolumeOffIcon from 'material-ui/svg-icons/av/volume-off';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './VideoPlayer.css';

class VideoPlayer extends React.Component {

  static propTypes = {
    source: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const volume = +localStorage.getItem('volumeLevel');

    this.video = null;
    this.videoControls = null;
    this.timer = 0;
    this.fullScreenTimer = 0;
    this.clicks = 0;
    this.state = {
      isPaused: false,
      isInFullScreen: false,
      isLoading: true,
      volume: isNaN(volume) ? 1 : volume,
      clicks: 0,
      currentTime: 0,
      duration: 0,
      buffered: 0,
    };
  }

  componentDidMount() {
    this.video.volume = this.state.volume;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props.source) {
      this.setState({
        isPaused: false,
        isInFullScreen: false,
      });
    }
  }

  handleVideoClick = () => {
    clearTimeout(this.timer);
    this.clicks = this.clicks + 1;

    if (this.clicks < 2) {
      this.timer = setTimeout(() => {
        this.togglePause();
        this.clicks = 0;
      }, 250);
    } else {
      this.clicks = 0;
    }
  }

  togglePause = () => {
    const isPaused = this.video.paused;

    this.setState({
      isPaused: !isPaused,
    }, () => {
      if (isPaused) {
        this.video.play();
      } else {
        this.video.pause();
      }
    });
  }

  toggleVolume = () => {
    const volume = this.state.volume > 0 ? 0 : (+localStorage.getItem('volumeLevel') || 1);

    this.setState({
      volume,
    }, () => {
      if (volume > 0) {
        localStorage.setItem('volumeLevel', volume);
      }

      this.video.volume = volume;
    });
  }

  volumeSliderChange = (e, newValue) => {
    this.setState({
      volume: newValue,
    }, () => {
      localStorage.setItem('volumeLevel', newValue);
      this.video.volume = newValue;
    });
  }

  videoProgressChange = (e, newValue) => {
    this.setState({
      currentTime: newValue,
      isPaused: false,
    }, () => {
      this.video.currentTime = newValue;

      if (this.video.paused) {
        this.video.play();
      }
    });
  }

  handleFullScreenMove = () => {
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement) {
      this.video.classList.remove(s.controlsHidden);
      return;
    }

    clearTimeout(this.fullScreenTimer);
    this.video.classList.remove(s.controlsHidden);

    this.fullScreenTimer = setTimeout(() => {
      this.video.classList.add(s.controlsHidden);
    }, 3000);
  }

  toggleFullScreen = () => {
    const elem = this.video;
    const isInFullScreen = !!document.fullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.webkitFullscreenElement;

    this.setState({
      isInFullScreen: !isInFullScreen,
    }, () => {
      if (!isInFullScreen && elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (!isInFullScreen && elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (!isInFullScreen && elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }

      if (isInFullScreen && document.cancelFullscreen) {
        document.cancelFullscreen();
      } else if (isInFullScreen && document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (isInFullScreen && document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    });
  }

  handleVideoDownload = () => {
    const lastRangeIndex = this.video.buffered.length - 1;

    this.setState({
      buffered: lastRangeIndex < 0 ? this.video.duration : this.video.buffered.end(lastRangeIndex),
    });
  }

  formatTime = (secs) => {
    const time = Math.floor(secs);
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);
    const hours = Math.floor(time / 3600);

    let timeString = hours > 0 ? `${hours}:` : '';
    timeString += minutes > 0 ? `${minutes}:` : '0:';
    timeString += (`0${seconds}`).slice(-2);

    return timeString;
  }

  render() {
    let volumeIcon = <VolumeUpIcon />;

    if (this.state.volume === 0) {
      volumeIcon = <VolumeOffIcon />;
    } else if (this.state.volume < 0.5) {
      volumeIcon = <VolumeDownIcon />;
    }

    return (
      <div>
        <div className={s.videoProportionsWrapper}>
          <video
            ref={(input) => {
              this.video = input;
            }}
            src={this.props.source}
            type="video/webm"
            className={`${s.video} ${this.state.isPaused ? s.paused : ''}`}
            onClick={this.handleVideoClick}
            onDoubleClick={this.toggleFullScreen}
            onMouseMove={this.handleFullScreenMove}
            onLoadedMetadata={() => this.setState({
              duration: this.video.duration,
            })}
            onTimeUpdate={() => this.setState({
              currentTime: this.video.currentTime,
            })}
            onPlaying={() => this.setState({
              isLoading: false,
            })}
            onWaiting={() => this.setState({
              isLoading: true,
            })}
            onProgress={this.handleVideoDownload}
            onEnded={() => this.setState({ isPaused: true })}
            autoPlay
          />
          {
            this.state.isLoading ? <CircularProgress className={s.videoLoading} /> : null
          }
          <div
            ref={(input) => {
              this.videoControls = input;
            }}
            className={s.videoControls}
          >
            <LinearProgress
              className={s.downloadingProgress}
              mode="determinate"
              value={this.state.buffered}
              max={this.state.duration}
            />
            <Slider
              className={s.playingProgress}
              value={this.state.currentTime}
              max={this.state.duration || 1}
              onChange={this.videoProgressChange}
              disableFocusRipple
            />
            <IconButton
              tooltip={this.state.isPaused ? 'Play' : 'Pause'}
              tooltipPosition="top-center"
              onTouchTap={this.togglePause}
            >
              {
                this.state.isPaused ? <PlayIcon /> : <PauseIcon />
              }
            </IconButton>
            <IconButton
              tooltip={this.state.volume > 0 ? 'Disable sound' : 'Enable sound'}
              tooltipPosition="top-center"
              onTouchTap={this.toggleVolume}
            >
              {volumeIcon}
            </IconButton>
            <Slider
              className={s.volumeSlider}
              value={this.state.volume}
              onChange={this.volumeSliderChange}
              disableFocusRipple
            />
            <div className={s.videoTimers}>
              {`${this.formatTime(this.state.currentTime)} / ${this.formatTime(this.state.duration)}`}
            </div>
            <IconButton
              className={s.toggleFullScreenBtn}
              tooltip={this.state.isInFullScreen ? 'Exit full screen' : 'Enter full screen'}
              tooltipPosition="top-left"
              onTouchTap={this.toggleFullScreen}
            >
              {
                this.state.isInFullScreen ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />
              }
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

VideoPlayer.defaultProps = {
  source: null,
};

export default withStyles(s)(VideoPlayer);
