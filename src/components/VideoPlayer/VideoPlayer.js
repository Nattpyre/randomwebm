import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Slider, LinearProgress, CircularProgress } from 'material-ui';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import ReplayIcon from 'material-ui/svg-icons/av/replay';
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

    const volume = typeof localStorage !== 'undefined' ? localStorage.getItem('volumeLevel') : 1;

    this.wrapper = null;
    this.video = null;
    this.timer = 0;
    this.fullScreenTimer = 0;
    this.clicks = 0;
    this.state = {
      isPaused: false,
      isPlayed: false,
      isInFullScreen: false,
      isLoading: false,
      volume: volume === null ? 1 : +volume,
      clicks: 0,
      currentTime: 0,
      duration: 0,
      buffered: 0,
    };
  }

  componentDidMount() {
    this.video.volume = this.state.volume;

    document.addEventListener('keydown', this.addHotKeys);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props.source) {
      this.setState({
        isPaused: false,
        isInFullScreen: false,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.addHotKeys);
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
    let volume = +newValue;

    if (volume < 0) {
      volume = 0;
    } else if (volume > 1) {
      volume = 1;
    }

    this.setState({
      volume,
    }, () => {
      localStorage.setItem('volumeLevel', volume);
      this.video.volume = volume;
    });
  }

  videoProgressChange = (e, newValue) => {
    let currentTime = +newValue;

    if (currentTime < 0) {
      currentTime = 0;
    } else if (currentTime > this.state.duration) {
      currentTime = this.state.duration;
    }

    this.setState({
      currentTime,
      isPaused: false,
    }, () => {
      this.video.currentTime = currentTime;

      if (this.video.paused) {
        this.video.play();
      }
    });
  }

  handleMouseMove = () => {
    clearTimeout(this.fullScreenTimer);
    this.video.classList.remove(s.controlsHidden);

    this.fullScreenTimer = setTimeout(() => {
      if (this.video) {
        this.video.classList.add(s.controlsHidden);
      }
    }, 3000);
  }

  toggleFullScreen = () => {
    const elem = this.wrapper;
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

  addHotKeys = (e) => {
    const keyCode = e.which || e.charCode;

    if (document.body.classList.contains('modal-open') || document.body.classList.contains('disable-hotkeys')) {
      return;
    }

    if (keyCode === 32 || keyCode === 75) {
      this.togglePause();
    } else if (keyCode === 70) {
      this.toggleFullScreen();
    } else if (keyCode === 74) {
      this.videoProgressChange(null, this.state.currentTime - 10);
    } else if (keyCode === 76) {
      this.videoProgressChange(null, this.state.currentTime + 10);
    } else if (keyCode === 37) {
      this.videoProgressChange(null, this.state.currentTime - 5);
    } else if (keyCode === 39) {
      this.videoProgressChange(null, this.state.currentTime + 5);
    } else if (keyCode === 38) {
      this.volumeSliderChange(null, this.state.volume + 0.05);
    } else if (keyCode === 40) {
      this.volumeSliderChange(null, this.state.volume - 0.05);
    } else if (keyCode === 77) {
      this.toggleVolume();
    }
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
    let playIcon = <PauseIcon />;
    let playStatus = 'Pause';

    if (this.state.volume === 0) {
      volumeIcon = <VolumeOffIcon />;
    } else if (this.state.volume < 0.5) {
      volumeIcon = <VolumeDownIcon />;
    }

    if (this.state.isPaused && this.state.currentTime >= this.state.duration) {
      playIcon = <ReplayIcon />;
      playStatus = 'Replay';
    } else if (this.state.isPaused) {
      playIcon = <PlayIcon />;
      playStatus = 'Play';
    }

    let videoIcon = null;

    if (this.video && this.state.isLoading) {
      videoIcon = <CircularProgress className={s.videoIcon} />;
    } else if (this.video && !this.state.isLoading && !this.state.isPlayed) {
      videoIcon = (
        <PlayIcon
          style={{ width: 64, height: 64, color: 'white' }}
          className={s.videoIcon}
          onClick={() => this.video.play()}
        />
      );
    }

    return (
      <div>
        <div
          id="video-player-wrapper"
          ref={(input) => {
            this.wrapper = input;
          }}
          className={s.videoProportionsWrapper}
        >
          <video
            ref={(input) => {
              this.video = input;
            }}
            src={this.props.source}
            type="video/webm"
            className={`${s.video} ${this.state.isPaused ? s.paused : ''}`}
            onClick={this.handleVideoClick}
            onDoubleClick={this.toggleFullScreen}
            onMouseMove={this.handleMouseMove}
            onLoadedMetadata={() => this.setState({
              duration: this.video.duration,
            })}
            onTimeUpdate={() => this.setState({
              currentTime: +this.video.currentTime,
            })}
            onPlaying={() => this.setState({
              isLoading: false,
              isPlayed: true,
            })}
            onWaiting={() => this.setState({
              isLoading: true,
            })}
            onProgress={this.handleVideoDownload}
            onEnded={() => this.setState({
              isPaused: true,
              isLoading: false,
            })}
            autoPlay
          />
          {videoIcon}
          <div
            className={s.videoControls}
            onMouseMove={this.handleMouseMove}
          >
            <div className={s.progressWrapper}>
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
            </div>
            <IconButton
              tooltip={playStatus}
              tooltipPosition="top-center"
              onTouchTap={this.togglePause}
            >
              {playIcon}
            </IconButton>
            <IconButton
              className={s.toggleVolumeBtn}
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
