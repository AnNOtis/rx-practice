var path = require('path')
var fs = require('fs')
var PATH = {
  src: path.join(__dirname, "src"),
}

var entries = {}
fs.readdirSync(PATH.src).forEach(function (dirpath) {
  if (dirpath === '.DS_Store') { return }
  entries[dirpath] = path.join(__dirname, 'src', dirpath)
})

module.exports = {
  devtool: 'source-map',
  entry: entries,
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'standard',
        include: PATH.src,
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        include: PATH.src,
        loader: 'babel',
      },
      {
        test: /\.sass$/,
        include: PATH.src,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      }
    ]
  },
};
