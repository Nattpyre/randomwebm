const config = {
  // AWS S3 configuration
  AWS: {
    bucket: 'randomwebm',
    region: 'eu-central-1',
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
