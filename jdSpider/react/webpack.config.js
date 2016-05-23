var path = require('path');

module.exports = {
  entry: './public/scripts/ThinkingInReact.js',
  output: {
    path: 'public/build',
    filename: 'ThinkingInReact.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          loader: "babel",
          query:
            {
               presets:['react']
            }
      }
    ]
  }
}
