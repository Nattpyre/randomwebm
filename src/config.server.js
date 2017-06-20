const s3 = require('./s3.json');

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

if (!Object.keys(s3).length) {
  throw new Error('Cannot find s3 credentials file in source folder.');
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost/randomwebm',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Amazon AWS
  AWS: {
    region: process.env.AWS_REGION || 'eu-central-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || s3.accessKeyId,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || s3.secretAccessKey,
    tokenDuration: process.env.AWS_TOKEN_DURATION || 43200,
  },
};
