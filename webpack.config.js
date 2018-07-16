const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    main: './src/app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.jpg|JPG|png$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'file-loader',
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: 'index.template.html',
    }),
  ],
  serve: {
    port: 8090,
  },
};
