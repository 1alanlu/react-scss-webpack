// This file will contain configuration data that
// is shared between development and production builds.
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  entry: {
    // Split vendor code into separate bundles
    vendor: ['react'],
    index: paths.appIndexJs,
    // main: './src/main.js'   //多页面设置直接添加即可，同时plugins需要加上一个新的HtmlWebpackPlugin
  },
  output: {
    filename: '[name].js', //打包后名称
    /**
     * With zero configuration,
     *   clean-webpack-plugin will remove files inside the directory below
     */
    path: paths.appBuild,
    publicPath: '/',
  },
  resolve: {
    //配合tree-shaking，优先使用es6模块化入口（import
    mainFields: ['jsnext:main', 'browser', 'main'],
    // File extensions. Add others and needed (e.g. scss, json)
    extensions: ['.js', '.jsx'],
    // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
    modules: ['node_modules'],
    // Aliases help with shortening relative paths
    // 'Components/button' === '../../../components/button'
    alias: {
      '@': paths.appSrc, // 缓存src目录为@符号，避免重复寻址
    },
  },
  module: {
    // 这些库都是不依赖其它库的库 不需要解析他们可以加快编译速度
    // 忽略未采用模块化的文件，因此jquery 或lodash 将不会被下面的loaders解析
    noParse: /jquery/, ///jquery|lodash/
    rules: [
      {
        // look for .js or .jsx files
        test: /\.(js|jsx)$/,
        // in the `src` directory
        include: [paths.appSrc],
        exclude: /node_modules/,
        use: {
          // use babel for transpiling JavaScript files
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.html$/,
        include: [paths.appSrc], // 表示只解析以下目录，减少loader处理范围
        use: [
          {
            loader: 'html-loader',
            options: {
              // minimize: true,
              attrs: ['img:src', 'img:data-src'],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024, // 小于字节的图片打包成base 64图片
              name: 'assets/images/[name].[ext]?[hash:8]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        // 文件依赖配置项——字体图标
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8 * 1024,
              name: 'assets/fonts/[name].[ext]?[hash:8]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        // 文件依赖配置项——音频
        test: /\.(wav|mp3|ogg)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8 * 1024,
              name: 'assets/audios/[name].[ext]?[hash:8]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        // 文件依赖配置项——视频
        test: /\.(ogg|mpeg4|webm)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8 * 1024,
              name: 'assets/videos/[name].[ext]?[hash:8]',
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 输出文件的名称
      template: paths.appHtml, // 模板文件的路径
      minify: {
        removeRedundantAttributes: true, // 删除多余的属性
        collapseWhitespace: true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true, // 省略只有 boolean 值的属性值 例如：readonly checked
      },
      chunks: ['manifest', 'vendor', 'utils', 'index'], //对应关系，index.js 对应的是index.html
    }),
  ],
  optimization: {
    //提取webpack运行时的代码
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'async', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
      maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
      automaticNameDelimiter: '~', // 命名分隔符
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      cacheGroups: {
        // 抽离第三方插件
        vendor: {
          test: /[\\/]node_modules[\\/]/, //指定是node_modules下的第三方包
          chunks: 'all',
          name: 'vendor', //打包后的文件名，任意命名
          priority: 10, //设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
        },
        // 抽离自己写的公共代码，utils这个名字可以随意起
        utils: {
          chunks: 'all',
          name: 'utils',
          minSize: 0, //只要超出0字节就生成一个新包
          minChunks: 2, //至少两个chucks用到
          // maxAsyncRequests: 1,             // 最大异步请求数， 默认1
          maxInitialRequests: 5, // 最大初始化请求书，默认1
        },
        // 缓存组，会继承和覆盖splitChunks的配置
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true, // 默认使用已有的模块
        },
      },
    },
  },
};
