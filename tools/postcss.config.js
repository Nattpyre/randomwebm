/* eslint-disable global-require */

module.exports = () => ({
  plugins: [
    require('postcss-import')(),
    require('postcss-custom-properties')(),
    require('postcss-custom-media')(),
    require('postcss-media-minmax')(),
    require('postcss-calc')(),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')(),
  ],
});
