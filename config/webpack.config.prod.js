// contains configuration data related to prod build
const webpack = require('webpack');
const merge = require('webpack-merge');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //每次都清空 dist 文件夹
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

const paths = require('./paths');
const base = require('./webpack.config.base.js');

module.exports = merge(base, {
  mode: 'production',
  // Set the name of our JS bundle using a chuckhash
  // (e.g. '5124f5efa5436b5b5e7d_app.js')
  // Location where built files will go.
  output: {
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.module\.s(a|c)ss$/,
        include: [paths.appSrc],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 在css中使用@import引入其他文件
              sourceMap: false,
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
              sourceMap: false,
              plugins: () => [
                postcssImport({ addDependencyTo: webpack }),
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        include: [paths.appSrc],
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 在css中使用@import引入其他文件
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: false,
              plugins: () => [
                postcssImport({ addDependencyTo: webpack }),
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
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
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    /**
     * All files inside webpack's output.path directory will be removed once, but the
     * directory itself will not be. If using webpack 4+'s default configuration,
     * everything under <PROJECT_DIR>/dist/ will be removed.
     * Use cleanOnceBeforeBuildPatterns to override this behavior.
     *
     * During rebuilds, all webpack assets that are not used anymore
     * will be removed automatically.
     *
     * See `Options and Defaults` for information
     */
    new CleanWebpackPlugin(),
    /* new CopyWebpackPlugin([
      // 支持输入一个数组, 静态资源引入拷贝
      {
        from: paths.appAssets, // 将src/assets下的文件
        to: './assets', // 复制到輸出目录下的assets文件夹中
      },
    ]), */
    // Set process.env.NODE_ENV to production
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name]-[id].[contenthash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // 用于配置 minimizers 和选项
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
});
