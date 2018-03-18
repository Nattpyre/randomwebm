import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import WriteFilePlugin from 'write-file-webpack-plugin';
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import clean from './clean';
import copy from './copy';

const isDebug = !process.argv.includes('--release');
process.argv.push('--watch');

const [clientConfig, serverConfig] = webpackConfig;

async function start() {
  await run(clean);
  await run(copy);
  await new Promise((resolve) => {
    serverConfig.plugins.push(new WriteFilePlugin({ log: false }));

    if (isDebug) {
      clientConfig.entry.client = [...new Set([
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
      ].concat(clientConfig.entry.client))];
      clientConfig.output.filename = clientConfig.output.filename.replace('[chunkhash', '[hash');
      clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('[chunkhash', '[hash');

      const { query } = clientConfig.module.rules.find(x => x.loader === 'babel-loader');

      query.plugins = ['react-hot-loader/babel'].concat(query.plugins || []);
      clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      clientConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }

    const bundler = webpack(webpackConfig);
    const wpMiddleware = webpackDevMiddleware(bundler, {
      publicPath: clientConfig.output.publicPath,
      stats: clientConfig.stats,
    });
    const hotMiddleware = webpackHotMiddleware(bundler.compilers[0]);

    let handleBundleComplete = async () => {
      handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && runServer();

      const server = await runServer();
      const bs = browserSync.create();

      bs.init({
        ...isDebug ? {} : { notify: false, ui: false },

        proxy: {
          target: server.host,
          middleware: [wpMiddleware, hotMiddleware],
          proxyOptions: {
            xfwd: true,
          },
        },
      }, resolve);
    };

    bundler.plugin('done', stats => handleBundleComplete(stats));
  });
}

export default start;
