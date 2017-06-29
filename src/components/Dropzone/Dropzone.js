import React from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import { LinearProgress } from 'material-ui';
import DoneIcon from 'material-ui/svg-icons/file/cloud-done';
import ErrorIcon from 'material-ui/svg-icons/alert/error-outline';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dropzone.css';

class Dropzone extends React.Component {
  static propTypes = {
    isUploaded: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    uploadPercent: PropTypes.number.isRequired,
    handleDropFiles: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);

    this.dropzoneInput = null;
  }

  render() {
    let dropzoneContent = null;

    if (this.props.error) {
      dropzoneContent = (
        <div className={s.dropzoneWrapper}>
          <ErrorIcon color="#F44336" style={{ width: 80, height: 80 }} />
          <span>Whoops! Something went wrong:</span>
          <span>{this.props.error}</span>
          <button type="button" className={s.uploadFileBtn} onClick={() => this.dropzoneInput.open()}>
            Try again
          </button>
        </div>
      );
    } else if (this.props.inProgress) {
      dropzoneContent = (
        <div className={s.uploadWrapper}>
          <LinearProgress
            className={s.progressBar}
            mode={this.props.uploadPercent > 0 ? 'determinate' : 'indeterminate'}
            value={this.props.uploadPercent}
          />
          <span className={s.uploadingText}>
            {this.props.uploadPercent > 0 ? `${this.props.uploadPercent}%` : 'Please wait...'}
          </span>
        </div>
      );
    } else if (this.props.isUploaded) {
      dropzoneContent = (
        <div className={s.dropzoneWrapper}>
          <DoneIcon color="#00bcd4" style={{ width: 80, height: 80 }} />
          <span>Webm has been uploaded.</span>
          <span>Do you want to upload
            <button type="button" className={s.uploadFileBtn} onClick={() => this.dropzoneInput.open()}>
              another one
            </button>?
          </span>
        </div>
      );
    } else {
      dropzoneContent = (
        <div>
          Drop webm to this zone or just click
          <button type="button" className={s.uploadFileBtn} onClick={() => this.dropzoneInput.open()}>
            here
          </button>
        </div>
      );
    }

    return (
      <ReactDropzone
        ref={(node) => {
          this.dropzoneInput = node;
        }}
        className={s.dropzone}
        onDrop={this.props.handleDropFiles}
        accept="video/webm"
        multiple={false}
        disableClick
      >
        {dropzoneContent}
      </ReactDropzone>
    );
  }
}

export default withStyles(s)(Dropzone);
