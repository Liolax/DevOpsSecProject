const path = require('path');
const webpack = require('webpack'); // Import webpack for DefinePlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Automatically clean up the dist folder
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    hot: true,      // Enables hot module replacement
    port: 3000,     
    https: false,   // Serve over HTTP (for local development)
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use babel-loader for JS/JSX files
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel')
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // Process CSS files
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Load image files as separate assets
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'], // Load source maps for debugging
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use HTML template from public folder
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    // Define environment variables to be injected into the app
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || (isDevelopment ? 'development' : 'production')),
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing JS and JSX files without specifying the extension
  },
};
