// configuration data related to development only
const webpack = require('webpack');
const merge = require('webpack-merge');

const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

const paths = require('./paths');
const base = require('./webpack.config.base.js');

module.exports = merge(base, {
  mode: 'development',
  // devtool option controls if and how source maps are generated.
  // see https://webpack.js.org/configuration/devtool/
  // If you find that you need more control of source map generation,
  // see https://webpack.js.org/plugins/source-map-dev-tool-plugin/
  devtool: 'eval',
  // devtool: '#source-map',                                 //方便断点调试
  // devtool: '#cheap-module-eval-source-map',            //构建速度快，采用eval执行
  module: {
    rules: [
      {
        test: /\.module\.s(a|c)ss$/,
        include: [paths.appSrc],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 在css中使用@import引入其他文件
              sourceMap: true,
              // This enables local scoped CSS based in CSS Modules spec
              modules: true,
              // generates a unique name for each class (e.g. app__app___2x3cr)
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                postcssImport({ addDependencyTo: webpack }),
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        include: [paths.appSrc],
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 在css中使用@import引入其他文件
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                postcssImport({ addDependencyTo: webpack }),
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          // Add additional loaders here. (e.g. sass-loader)
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  optimization: {
    minimize: false,
  },
});
