const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100']
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@src": path.resolve(__dirname, 'src'),
      "@auth": path.resolve(__dirname, 'src/auth'),
      "@config": path.resolve(__dirname, 'src/config'),
      "@constants": path.resolve(__dirname, 'src/constants'),
      "@common": path.resolve(__dirname, 'src/common'),
      "@environment": path.resolve(__dirname, 'src/environment'),
      "@entities": path.resolve(__dirname, 'src/entities'),
      "@resolvers": path.resolve(__dirname, 'src/resolvers'),
      "@utils": path.resolve(__dirname, 'src/utils'),
      "@generator": path.resolve(__dirname, 'src/generator'),
      "@interceptors": path.resolve(__dirname, 'src/interceptors')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new StartServerPlugin({ name: 'main.js' })
  ],
  output: {
    path: path.join(__dirname, 'dist')
  }
}
