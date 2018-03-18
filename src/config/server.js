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
  databaseUrl: process.env.DATABASE_URL,

  // Authentication
  auth: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: 60 * 60 * 24 * 180, // 180 days
    },
  },

  // Amazon AWS
  AWS: {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    tokenDuration: process.env.S3_TOKEN_DURATION,
  },
};
