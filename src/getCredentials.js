import AWS from 'aws-sdk';
import config from './config.server';

function getCredentials() {
  return new Promise((resolve, reject) => {
    const STS = new AWS.STS({
      credentials: new AWS.Credentials(
        config.AWS.accessKeyId,
        config.AWS.secretAccessKey,
      ),
      region: config.AWS.region,
      apiVersion: 'latest',
    });

    STS.getSessionToken({
      DurationSeconds: config.AWS.tokenDuration,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Credentials);
      }
    });
  });
}

export default getCredentials;