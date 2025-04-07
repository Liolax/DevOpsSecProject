const path = require('path');
const webpack = require('webpack'); // Import webpack for DefinePlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',

  // Improve source map generation:
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Automatically clean up the dist folder
  },

  devServer: {
    static: path.join(__dirname, 'public'),
    hot: true,      // Enables hot module replacement in development
    port: 3000,     
    https: false,   // Serve over HTTP (for local development)
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile JS/JSX files using Babel
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
        type: 'asset/resource', // Handle image assets
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
      template: './public/index.html', // HTML template to generate index.html
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    // Inject environment variables into the app
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || (isDevelopment ? 'development' : 'production')),
    }),
  ].filter(Boolean),

  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing without specifying extensions
  },
};
