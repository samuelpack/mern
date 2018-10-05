module.exports = {
  entry: './src/App.jsx',
  mode: 'none',
  output: {
    path: __dirname + './static',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
