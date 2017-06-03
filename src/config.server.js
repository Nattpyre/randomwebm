/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
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
    bucket: process.env.AWS_BUCKET || 'randomwebm',
    webmsFolder: process.env.AWS_WEBMS_FOLDER || 'webms',
    previewsFolder: process.env.AWS_PREVIEWS_FOLDER || 'previews',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAIF63LOXRTYNCLKEQ',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
    tokenDuration: process.env.AWS_TOKEN_DURATION || 43200,
  },
};
