import webpack from 'webpack';

module.exports = {
  entry: './src/index',
  output: {
    path: __dirname + '/dist',
    filename: 'app.bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname + '/src',
      },
      {
        test: /\.css/,
        loader: 'style!css!',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass!',
      },
    ]
  },
};
