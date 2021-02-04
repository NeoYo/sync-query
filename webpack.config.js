const wba = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'dev';
const isStat = process.env.NODE_ENV === 'stat';

const config = {
  optimization: {
    // minimize 压缩代码
    minimize: false,
  },
  devtool: 'source-map',
  mode: isDev ?  'development' : 'production',
  entry: {
    app: './src/index.ts'
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8081,
    host: '0.0.0.0',
    headers: {
      // 和 script cross-origin 配合使用
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env', {
                  targets: {
                    browsers: ['>1%']
                  }
                }
              ]
            ],
            // plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // index.ejs is just for debug
    // new htmlWebpackPlugin({
    //   filename: "index.html",
    //   template: "./index.ejs",
    // }),
  ]
}

if (isStat) {
  config.plugins.push(new wba({
    analyzerPort: 9999
  }));
}

module.exports = config;
