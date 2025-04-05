const path = require('path');
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
    https: false,   // HTTP, not HTTPS
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
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // Process CSS files
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Load image files
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
      template: './public/index.html', // Use HTML template
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing JS and JSX without extension
  },
};
