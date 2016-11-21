const path = require('path')
const glob = require('glob')

module.exports = {
  entry: glob.sync(path.resolve(__dirname, '../test/**/*.ts')),
  output: {
    path: path.resolve(__dirname, '../.tmp'),
    filename: 'test.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json', '.ts']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'webpack-espower!ts' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  devtool: 'source-map'
}
