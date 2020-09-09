var path = require('path');
var CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'harpokrat-hcl': './src/public-api.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '@harpokrat/hcl',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'src/assets/*', to: '../assets/[name].[ext]'},
        {from: 'src/package.dist.json', to: '../package.json'}
      ]
    })
  ]
};

