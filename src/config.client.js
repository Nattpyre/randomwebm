/* eslint-disable max-len */

if (process.env.SERVER) {
  throw new Error('Do not import `config.js` from outside the client-side code.');
}

module.exports = {
  // Amazon AWS
  AWS: {
    region: process.env.AWS_REGION || 'eu-central-1',
    bucket: process.env.AWS_BUCKET || 'randomwebm',
    webmsFolder: process.env.AWS_WEBMS_FOLDER || 'webms',
    previewsFolder: process.env.AWS_PREVIEWS_FOLDER || 'previews',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    tokenDuration: process.env.AWS_TOKEN_DURATION || 43200,
  },

  // Webm
  webm: {
    chunkSize: 2097152,
  },
};
