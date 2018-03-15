const config = {
  // AWS S3 configuration
  AWS: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    webmsFolder: 'webms',
    previewsFolder: 'previews',
  },

  // In MB
  maxFileSize: 50,

  // In pixels
  previewWidth: 640,
  previewHeight: 360,
};

export default config;
