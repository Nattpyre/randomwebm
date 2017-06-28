import AWS from 'aws-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, LinearProgress, TextField } from 'material-ui';
import Dropzone from 'react-dropzone';
import SparkMD5 from 'spark-md5';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UploadDialog.css';
import config from '../../config.client';

class UploadDialog extends React.Component {

  static contextTypes = {
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.bucket = null;
    this.dropzoneInput = null;

    this.state = {
      inProgress: false,
      uploadPercent: 0,
      webm: {
        blob: null,
        hash: null,
        file: null,
        source: null,
      },
    };
  }

  componentDidMount = () => {
    const credentials = window.App.credentials;

    AWS.config.region = config.AWS.region;
    AWS.config.credentials = new AWS.Credentials(
      credentials.AccessKeyId,
      credentials.SecretAccessKey,
      credentials.SessionToken,
    );

    this.bucket = new AWS.S3({ params: { Bucket: config.AWS.bucket } });
  }

  getFileHash = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binary = e.target.result;
      const md5 = SparkMD5.hashBinary(binary);
      const webmState = { ...this.state.webm };

      webmState.hash = md5;
      this.setState({
        webm: webmState,
      });

      callback(md5);
    };

    reader.readAsBinaryString(file);
  }

  getVideoThumbnail = (file, callback) => {
    const video = document.createElement('video');
    const events = ['loadedmetadata', 'loadeddata', 'suspend'];
    let eventsFired = 0;

    video.muted = true;
    video.className = s.previewGenerator;

    document.body.appendChild(video);

    const handler = (e) => {
      e.target.removeEventListener(e.type, handler);

      if (++eventsFired === 3) {
        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);

          const preview = canvas.toDataURL('image/jpeg');

          canvas.remove();
          video.remove();

          this.context.fetch(preview)
            .then(res => res.arrayBuffer())
            .then((buffer) => {
              const image = new File([buffer], 'image.jpg', { type: 'image/jpeg' });

              callback(image);
            });
        });

        video.currentTime = 1;
      }
    };

    events.forEach(event => video.addEventListener(event, handler));

    video.src = this.state.webm.blob;
  }

  handleDropFiles = (files) => {
    const webm = files[0];
    const url = window.URL || window.webkitURL;

    this.getFileHash(webm, (hash) => {
      this.context.fetch(`/graphql?query={
                                            webms(hash:"${hash}") {
                                              id
                                            }
      }`).then(response => response.json()).then((data) => {
        if (data.data.webms.length > 0) {
          throw new Error('Webm already uploaded!');
        }

        const webmState = { ...this.state.webm };

        webmState.file = webm;
        webmState.blob = url.createObjectURL(webm);

        this.setState({
          webm: webmState,
        });
      });
    });
  }

  handleSourceInputChange = (e) => {
    const webmState = { ...this.state.webm };

    webmState.source = e.target.value;

    this.setState({
      webm: webmState,
    });
  }

  handleUpload = () => {
    const webm = this.state.webm.file;

    this.getVideoThumbnail(webm, (preview) => {
      this.setState({
        inProgress: true,
      });

      this.bucket.upload({
        Key: `${config.AWS.previewsFolder}/${this.state.webm.hash}.jpg`,
        ContentType: 'image/jpeg',
        Body: preview,
        ACL: 'public-read',
        StorageClass: 'STANDARD',
      }).send((err, previewInfo) => {
        this.bucket.upload({
          Key: `${config.AWS.webmsFolder}/${this.state.webm.hash}.webm`,
          ContentType: 'video/webm',
          Body: webm,
          ACL: 'public-read',
          StorageClass: 'STANDARD',
        }).on('httpUploadProgress', (e) => {
          this.setState({
            uploadPercent: Math.round((e.total ? ((e.loaded * 100) / e.total) : 0)),
          });
        }).send((error, videoInfo) => {
          this.context.fetch(`/graphql?query=mutation {
                                        uploadWebm(
                                          originalName: "${webm.name}",
                                          source: "${this.state.webm.source}",
                                          hash: "${this.state.webm.hash}",
                                          url: "${videoInfo.Location}",
                                          previewUrl: "${previewInfo.Location}"
                                        ) {
                                          id
                                        }
          }`).then(response => response.json()).then(() => {
            this.setState({
              inProgress: false,
              uploadPercent: 0,
              webm: {
                blob: null,
                hash: null,
                file: null,
                source: null,
              },
            });
          });
        });
      });
    });
  }

  render() {
    return (
      <Dialog
        actions={[
          <FlatButton label="Cancel" onTouchTap={this.props.toggleUploadDialog} disabled={this.state.inProgress} />,
          <FlatButton label="Upload" onTouchTap={this.handleUpload} primary disabled={this.state.inProgress} />,
        ]}
        title="Upload Webm"
        open={this.props.isUploadDialogOpen}
        onRequestClose={this.state.inProgress ? null : this.props.toggleUploadDialog}
      >
        {
          this.state.webm.blob && !this.state.inProgress ?
            <div>
              <video className={s.videoPreview} src={this.state.webm.blob} muted autoPlay loop />
              <TextField
                onBlur={this.handleSourceInputChange}
                floatingLabelText="Webm source (optional)"
                rows={2}
                multiLine
                fullWidth
              />
            </div>
            :
            <Dropzone
              ref={(node) => {
                this.dropzoneInput = node;
              }}
              className={s.dropzone}
              onDrop={this.handleDropFiles}
              accept="video/webm"
              multiple={false}
              disableClick
            >
              {
                this.state.inProgress ?
                  <div className={s.uploadWrapper}>
                    <LinearProgress
                      className={s.progressBar}
                      mode={this.state.uploadPercent > 0 ? 'determinate' : 'indeterminate'}
                      value={this.state.uploadPercent}
                    />
                    <span className={s.uploadingText}>
                      {this.state.uploadPercent > 0 ? `${this.state.uploadPercent}%` : 'Please wait...'}
                    </span>
                  </div>
                  :
                  <div>
                    Drop webm to this zone or just click
                    <button type="button" className={s.uploadFileBtn} onClick={() => this.dropzoneInput.open()}>
                      here
                    </button>
                  </div>
              }
            </Dropzone>
        }
      </Dialog>
    );
  }
}

UploadDialog.propTypes = {
  isUploadDialogOpen: PropTypes.bool.isRequired,
  toggleUploadDialog: PropTypes.func.isRequired,
};

export default withStyles(s)(UploadDialog);
