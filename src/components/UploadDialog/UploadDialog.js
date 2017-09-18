import AWS from 'aws-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, TextField } from 'material-ui';
import ChipInput from 'material-ui-chip-input';
import SparkMD5 from 'spark-md5';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dropzone from '../Dropzone';
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

    this.state = {
      inProgress: false,
      isUploaded: false,
      error: null,
      uploadPercent: 0,
      autoCompleteTags: [],
      tagsArray: [],
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

      eventsFired += 1;

      if (eventsFired === 3) {
        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          const previewSize = this.calcPreviewSize(
            video.videoWidth,
            video.videoHeight,
            config.previewWidth,
            config.previewHeight,
          );

          canvas.width = config.previewWidth;
          canvas.height = config.previewHeight;

          canvas.getContext('2d').drawImage(video,
            (config.previewWidth / 2) - (previewSize.width / 2),
            (config.previewHeight / 2) - (previewSize.height / 2),
            previewSize.width,
            previewSize.height,
          );

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

  handleInputFocus = () => {
    if (this.state.autoCompleteTags.length > 0) {
      return;
    }

    this.context.fetch(`/graphql?query=
    {
      getTags {
        name
      }
    }`).then(response => response.json()).then((data) => {
      const autoCompleteTags = data.data.getTags.map(tag => tag.name);

      this.setState({
        autoCompleteTags,
      });
    });
  }

  handleDropFiles = (files, rejected) => {
    const webm = files[0];
    const url = window.URL || window.webkitURL;

    if (rejected.length > 0) {
      rejected.forEach((file) => {
        if (file.type !== 'video/webm') {
          this.setState({
            error: 'Wrong file format.',
          });
        } else if (file.size > (config.maxFileSize * 1024 * 1024)) {
          this.setState({
            error: 'Exceeded maximum file size',
          });
        }
      });

      return;
    }

    this.getFileHash(webm, (hash) => {
      this.context.fetch(`/graphql?query=
        {
          getWebm(hash:"${hash}") {
            id
          }
      }`).then(response => response.json()).then((data) => {
        if (data.data.getWebm) {
          this.setState({
            error: 'Webm already uploaded.',
          });

          return;
        }

        const webmState = { ...this.state.webm };

        webmState.file = webm;
        webmState.blob = url.createObjectURL(webm);

        this.setState({
          webm: webmState,
          error: null,
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
      }).send((error, previewInfo) => {
        if (error) {
          this.setState({
            error: error.message,
          });

          return;
        }

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
        }).send((err, videoInfo) => {
          if (err || !webm.name || !this.state.webm.hash) {
            this.setState({
              error: err ? err.message : 'File uploading error.',
            });

            return;
          }

          this.context.fetch(`/graphql?query=
            mutation {
              uploadWebm(
                originalName: "${webm.name}",
                source: ${this.state.webm.source ? `"${this.state.webm.source}"` : null},
                hash: "${this.state.webm.hash}",
                url: "${videoInfo.Location}",
                previewUrl: "${previewInfo.Location}",
                tags: ${JSON.stringify(this.state.tagsArray)}
              ) {
                id
              }
          }`).then(response => response.json()).then((response) => {
            if (response.errors) {
              this.setState({
                error: response.errors[0].message,
              });

              return;
            }

            this.setState({
              isUploaded: true,
              inProgress: false,
              uploadPercent: 0,
              tagsArray: [],
              webm: {
                blob: null,
                hash: null,
                file: null,
                source: null,
              },
              error: null,
            });
          });
        });
      });
    });
  }

  handleClose = () => {
    this.setState({
      isUploaded: false,
      inProgress: false,
      uploadPercent: 0,
      tagsArray: [],
      webm: {
        blob: null,
        hash: null,
        file: null,
        source: null,
      },
      error: null,
    });

    this.props.toggleUploadDialog();
  }

  addTag = (tag) => {
    const tags = this.state.tagsArray;

    tags.push(tag);

    this.setState({
      tagsArray: tags,
    });
  }

  deleteTag = (tag, index) => {
    const tags = this.state.tagsArray;

    tags.splice(index, 1);

    this.setState({
      tagsArray: tags,
    });
  }

  calcPreviewSize = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  render() {
    return (
      <Dialog
        className={s.uploadDialog}
        actions={[
          <FlatButton label="Cancel" onTouchTap={this.handleClose} />,
          <FlatButton
            label="Upload"
            onTouchTap={this.handleUpload}
            disabled={this.state.inProgress || !this.state.webm.blob}
            primary
          />,
        ]}
        title="Upload Webm"
        open={this.props.isUploadDialogOpen}
        onRequestClose={
          !this.state.error && this.state.inProgress ? null : this.handleClose
        }
      >
        {
          this.state.webm.blob && !this.state.inProgress ?
            <div>
              <video className={s.videoPreview} src={this.state.webm.blob} muted autoPlay loop />
              <ChipInput
                value={this.state.tagsArray}
                dataSource={this.state.autoCompleteTags}
                onFocus={this.handleInputFocus}
                onRequestAdd={this.addTag}
                onRequestDelete={this.deleteTag}
                floatingLabelText="Tags"
                fullWidth
              />
              <TextField
                onBlur={this.handleSourceInputChange}
                floatingLabelText="Webm source (optional)"
                fullWidth
              />
            </div>
            :
            <Dropzone
              isUploaded={this.state.isUploaded}
              inProgress={this.state.inProgress}
              uploadPercent={this.state.uploadPercent}
              handleDropFiles={this.handleDropFiles}
              error={this.state.error}
            />
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
