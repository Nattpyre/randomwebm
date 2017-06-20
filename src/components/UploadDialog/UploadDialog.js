import AWS from 'aws-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton } from 'material-ui';
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
    this.state = {
      webm: null,
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

      callback(md5);
    };

    reader.readAsBinaryString(file);
  }

  getVideoThumbnail = (file, callback) => {
    const url = window.URL || window.webkitURL;
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

          const preview = canvas.toDataURL();

          canvas.remove();
          video.remove();

          this.context.fetch(preview)
            .then(res => res.arrayBuffer())
            .then((buffer) => {
              const image = new File([buffer], 'test.png', { type: 'image/png' });

              callback(image);
            });
        });

        video.currentTime = 1;
      }
    };

    events.forEach(event => video.addEventListener(event, handler));

    video.src = url.createObjectURL(file);
  }

  handleDropFiles = (files) => {
    const webm = files[0];

    this.getFileHash(webm, (hash) => {
      this.context.fetch(`/graphql?query={
                                            webms(hash:"${hash}") {
                                              id
                                            }
      }`).then(response => response.json()).then((data) => {
        if (data.data.webms.length > 0) {
          throw new Error('Webm already uploaded!');
        }

        this.getVideoThumbnail(webm, (preview) => {
          this.bucket.upload({
            Key: `${config.AWS.previewsFolder}/${hash}.png`,
            ContentType: 'image/png',
            Body: preview,
            ACL: 'public-read',
            StorageClass: 'STANDARD',
          }).on('httpUploadProgress', (e) => {
            console.log(Math.round((e.total ? ((e.loaded * 100) / e.total) : 0)));
          }).send((err, previewInfo) => {
            this.bucket.upload({
              Key: `${config.AWS.webmsFolder}/${hash}.webm`,
              ContentType: 'video/webm',
              Body: webm,
              ACL: 'public-read',
              StorageClass: 'STANDARD',
            }).on('httpUploadProgress', (e) => {
              console.log(Math.round((e.total ? ((e.loaded * 100) / e.total) : 0)));
            }).send((error, videoInfo) => {
              this.context.fetch(`/graphql?query=mutation {
                                        uploadWebm(
                                          originalName: "${webm.name}",
                                          source: "${webm.name}",
                                          hash: "${hash}",
                                          url: "${videoInfo.Location}",
                                          previewUrl: "${previewInfo.Location}"
                                        ) {
                                          id
                                        }
                }`).then(response => response.json()).then((webmInfo) => {
                console.log(webmInfo);
              });
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
          <FlatButton label="Cancel" onTouchTap={this.props.toggleUploadDialog} />,
          <FlatButton label="Upload" primary />,
        ]}
        title="Upload Webm"
        open={this.props.isUploadDialogOpen}
        onRequestClose={this.props.toggleUploadDialog}
      >
        Choose a webm to upload!
        <Dropzone onDrop={this.handleDropFiles} />
      </Dialog>
    );
  }
}

UploadDialog.propTypes = {
  isUploadDialogOpen: PropTypes.bool.isRequired,
  toggleUploadDialog: PropTypes.func.isRequired,
};

export default withStyles(s)(UploadDialog);
