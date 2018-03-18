import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import AWS from 'aws-sdk';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import config from '../../config/server';
import params from '../../config/client';
import verifyToken from '../../utils/verifyToken';

const removeWebm = {
  type: WebmType,
  args: {
    id: { type: new NonNull(StringType) },
  },
  resolve(root, { id }) {
    if (!verifyToken(root.request.headers.authorization)) {
      throw new Error('You do not have permissions to perform this action.');
    }

    return Webm.findOne({ where: { id } }).then(webm => new Promise((resolve, reject) => {
      AWS.config.update(config.AWS);

      const s3 = new AWS.S3();

      s3.deleteObjects({
        Bucket: params.AWS.bucket,
        Delete: {
          Objects: [
            {
              Key: `${params.AWS.webmsFolder}/${webm.hash}.webm`,
            },
            {
              Key: `${params.AWS.previewsFolder}/${webm.hash}.jpg`,
            },
          ],
          Quiet: false,
        },
      }, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(() => webm.destroy()).then(() => webm));
  },
};

export default removeWebm;
