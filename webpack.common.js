var path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin =  require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
  console.log('Production', env.production)
  return {
      entry : './src/index.js',
      output : {
          path : path.resolve(__dirname , 'dist'),
          filename: 'index_bundle.js'
      },
      module : {
          rules : [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
										plugins: ["@babel/plugin-syntax-dynamic-import"]
									}
                }
              },
              // Using both Pure CSS: import './index.scss'
              {
                test: /\.(sa|sc|c)ss$/i,
                exclude: /\.module\.(sa|sc|c)ss$/i,
                use: [
                  env.production
                    ? MiniCssExtractPlugin.loader
                    : 'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: env.production ? false : true,
                    }
                  },
                  {
                    loader: 'sass-loader',
                  },
                ],
              },
              // And CSS modules: import styles from './index.module.css'
              {
                test: /\.module\.(sa|sc|c)ss$/i,
                use: [
                  env.production
                    ? MiniCssExtractPlugin.loader
                    : 'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: env.production ? false : true,
                      localsConvention: 'camelCase',
                      modules: true
                    }
                  },
                  {
                    loader: 'sass-loader',
                  },
                ],
              },
              // File Loader & Url Loader
              {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  outputPath: 'assets'
                },
              },
          ]
      },
      plugins : [
          new CleanWebpackPlugin({
            verbose: true
          }),
          new HtmlWebpackPlugin ({
              template : './src/public/index.html',
              favicon: 'src/public/favicon.ico'
          }),
          new MiniCssExtractPlugin({
            filename: env.production ? '[name].[hash].css' : '[name].css',
            chunkFilename: env.production ? '[id].[hash].css' : '[id].css',
            ignoreOrder: false,
          }),
      ]
  }
} 