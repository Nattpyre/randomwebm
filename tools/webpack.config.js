import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import pkg from '../package.json';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

const config = {
  context: path.resolve(__dirname, '..'),

  output: {
    path: path.resolve(__dirname, '../build/public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        query: {
          cacheDirectory: isDebug,
          babelrc: false,
          presets: [
            ['env', {
              targets: {
                browsers: pkg.browserslist,
              },
              modules: false,
              useBuiltIns: false,
              debug: false,
            }],
            'stage-2',
            'react',
            ...isDebug ? [] : ['react-optimize'],
          ],
          plugins: [
            ...isDebug ? ['transform-react-jsx-source'] : [],
            ...isDebug ? ['transform-react-jsx-self'] : [],
          ],
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: isDebug,
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: !isDebug,
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: [
          path.resolve(__dirname, '../src'),
        ],
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              modules: false,
              minimize: !isDebug,
              discardComments: { removeAll: true },
            },
          },
        ],
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
          limit: 10000,
        },
      },
      ...isDebug ? [] : [
        {
          test: path.resolve(__dirname, '../node_modules/redbox-react/lib/index.js'),
          use: 'null-loader',
        },
        {
          test: path.resolve(__dirname, '../node_modules/react-deep-force-update/lib/index.js'),
          use: 'null-loader',
        },
      ],
    ],
  },
  bail: !isDebug,
  cache: isDebug,
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },
};

const clientConfig = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', './src/client.js'],
  },

  output: {
    ...config.output,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      'process.env.S3_REGION': `'${process.env.S3_REGION}'`,
      'process.env.S3_BUCKET': `'${process.env.S3_BUCKET}'`,
      __DEV__: isDebug,
    }),

    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),

    ...isDebug ? [] : [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true,
          warnings: isVerbose,
          unused: true,
          dead_code: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ],
    ...isAnalyze ? [new BundleAnalyzerPlugin()] : [],
  ],
  devtool: isDebug ? 'cheap-module-source-map' : false,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

const serverConfig = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: ['babel-polyfill', './src/server.js'],
  },

  output: {
    ...config.output,
    filename: '../../server.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    ...config.module,

    rules: config.module.rules.map(rule => (rule.loader !== 'babel-loader' ? rule : {
      ...rule,
      query: {
        ...rule.query,
        presets: rule.query.presets.map(preset => (preset[0] !== 'env' ? preset : ['env', {
          targets: {
            node: pkg.engines.node.match(/(\d+\.?)+/)[0],
          },
          modules: false,
          useBuiltIns: false,
          debug: false,
        }])),
      },
    })),
  },

  externals: [
    /^\.\/assets\.json$/,
    (context, request, callback) => {
      const isExternal =
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      callback(null, Boolean(isExternal));
    },
  ],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': false,
      __DEV__: isDebug,
    }),

    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: isDebug ? 'cheap-module-source-map' : 'source-map',
};

export default [clientConfig, serverConfig];
