# REACT APP EXAMPLE

A React app created without create-react-app that will be used to communicate with my [Rails Api](https://github.com/mariosar/api_example/)

## Steps to reproduce project

```
mkdir react_app_example && cd $_
yarn init -y
yarn add react react-dom
```

Initialize our repository, but first create a .gitignore:
```
touch .gitignore
```
```
# .gitignore
node_modules

# Generated by webpack during compiliation process. Does not need to be committed. Will be generated in production during compilation.
dist
```
```
git init
git add .
git commmit -m "init"
```

## Hello World Example
```
mkdir -p src/public && touch src/index.js src/index.css src/public/index.html
```
```
# index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React App</title>
</head>
<body>
  <div id="app"></div> 
</body>
</html>

# src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component{
    render(){
        return(
            <div>Hello World</div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
```
We're using JSX syntax, ES6 Syntax. None of this is understood by the browser... yet. We'll use Webpack to bundle our JS. Webpack has a powerful ability to *transform* resources using loaders. We'll use these loaders to convert our ES6 and ReactJSX syntax into bundles that are understood by the browser.

## Dev Dependencies
Add these as dev dependencies... they're dependencies required to *develop* your app or to *build* your bundle.
```
yarn add -D @babel/core @babel/preset-env @babel/preset-react
yarn add -D webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader html-webpack-plugin
yarn add -D http-server
```

##### Webpack
> webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset [read more](https://github.com/webpack/webpack)

##### babel-loader
> This package allows transpiling JavaScript files using Babel and webpack. [read more](https://webpack.js.org/loaders/babel-loader/)

##### css-loader
> Allows you to write import / require() to load css files. [read more](https://github.com/webpack-contrib/css-loader)

##### style-loader
> Adds CSS to the dom by injecting style tag inside `<head></head>` [read more](https://github.com/webpack-contrib/style-loader)

##### clean-webpack-plugin
> By default, this plugin will remove all files inside webpack's output.path directory, as well as all unused webpack assets after every successful rebuild. [read more](https://github.com/johnagan/clean-webpack-plugin)

This is a handy plugin that will tear down `dist` folder on each build. Remember we added `dist` to our `.gitignore`. This folder is built when we transpile and bundle our application using webpack. This plugin will help remove `dist` before a new rebuild of our application - just good house cleaning.

##### html-webpack-plugin
> This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles. Useful for webpack bundles that contain hash that changes every compilation. Plugin will generate html file for you and inject bundled js file. [read more](https://github.com/jantimon/html-webpack-plugin)

Our application isn't just serving a bundled JS file, but an html page *with our bundled js* inside of it. When we move to production builds, we'll often fingerprint our bundled JS to let the browser know to grab a fresh copy instead of using a cached version of our application. How terribly sad it would be if every time we had an update to our production application we had to enter the html file and edit the script url - so lame. This plugin solves that.

##### webpack-dev-server
> Use webpack with a development server that provides live reloading (for development). [read more](https://github.com/webpack/webpack-dev-server)

This is our development server. It runs in memory so you won't see the `dist` folder with the bundle. To see the files in development, you'll want to run `webpack` command. This development server creates a socket with the browser and watches our application files. Whenever there is a change, it will refresh our page. Pretty neat.

##### http-server
> `http-server` is a simple, zero-configuration command-line http server. It is powerful enough for production usage, but it's simple and hackable enough to be used for testing, local development, and learning. [read more](https://www.npmjs.com/package/http-server)

Optionally, we can run `webpack` to build our application and simply run `http-server ./dist`. We may want to run our production build and test it out on our local machine before deployment. http-server is a ready-to-use tool for that.

### Next Steps
Webpack needs to be told what to do, so we'll create a webpack.config.js file. It does nothing more than export a JS object with some configuration for webpack.
```
touch webpack.config.js
```
```
# webpack.config.js

var path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './src/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js'
    },
    module : {
        rules : [
            {
              test: /\.m?jsx?$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
                }
              }
            },
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
        ]
    },
    mode:'development',
    plugins : [
        new CleanWebpackPlugin({
            verbose: true
        }),
        new HtmlWebpackPlugin ({
            template : './src/public/index.html'
        })
    ]
}
```

In the above config we are telling webpack to use the `babel-loader` on files ending in `/\.m?jsx?$/`, we still need to tell the transpiler (babel-loader) that we are compiling React and ES6 syntax. There are several ways of doing this:
```
# .babelrc
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}

# package.json
"babel": {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
},

# webpack.config.js - just after babel-loader
options: {
    presets: ['@babel/preset-env', '@babel/preset-react']
}
```
Good! now our [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) knows our `presets`. You can learn more about cool presets that are out there so you can be on the bleeding edge of all that's happening with JS.

### Webpack Basics

Our webpack has
- an entry
- an output
- some rules
- a mode
- and some plugins. 

**The entry** tells webpack where to start, what is the root of our application. Webpack supports multiple entries.

**The output** will be our `dist` folder. Once webpack has completed its job, that's where the bundled js and everything will live.

**The rules** are a collection of *regex tests* against *file paths* as webpack goes about bundling our code. If the rule is true, then it executes our specified loader that we've attached. ***NOTE:*** while rules can return true, we can also exclude certain files. Our `node_modules` have already been transpiled and minified by their creator, so we do not need to run our transpiler on them a second time. We've excluded them from our babel-loader. Here we've also told webpack to use the babel-loader with `preset-env` and `preset-react`. Preset-env allows you to use latest ES6 syntax. Preset-react allows you to use JSX syntax.

**Plugins** are useful utilities. We've included one that generates the html page required to serve our bundled js file.

### package.json scripts

While we can write out the command to webpack bundle or run our webpack-dev-server right in the terminal - seriously, what a pain. Let's write them once under "scripts" inside our package.json object and on the command line we'll simply type `yarn` followed by the alias we've defined.

Here are some examples you can add there now:

```
# package.json

{
 ...
  "scripts": {
    "start": "node_modules/.bin/http-server ./dist",
    "start:dev": "node_modules/.bin/webpack-dev-server --config webpack.config.js --open --hot",
    "dev": "node_modules/.bin/webpack --config webpack.config.js",
    "build": "node_modules/.bin/webpack -p --config webpack.config.js",
  }
}
```

Now run `yarn start:dev` and we'll have our application automatically compiled and served by `webpack-dev-server`. Hurray! You'll notice, there may not be a `dist` folder. That's because webpack-dev-server does everything *in memory*. To see the bundle, run `yarn dev`. Then to serve that bundle using `http-server` run `yarn start`.

### Additional Loaders and Dev Dependencies
#### Sass-Loader
Likely, we will be using less or sass/scss. We need to add a loader that will check the file extension and transpile into regular old css. `sass-loader` is the solution I've gone with. [read more](https://github.com/webpack-contrib/sass-loader)
```
yarn add -D sass-loader node-sass
```
#### Images
If we plan on importing svg, png, jpeg, fonts, etc... Then we need a loader for that.
```
yarn add -D file-loader url-loader
```
##### Url-Loader
> will encode files to base64 and include them inline rather than having them loaded as separate files with another request. [read more](https://webpack.js.org/loaders/url-loader/)

PRO: Ideal for very small files to decrease the number of requests made to the server fetching resources.
CON: will increase your bundle size.

For small files it totally makes sense. No need to make unnecessary requests to the server if you can just base64 inline the image instead. **NOTE:** Specify the limit in bytes to try and url-load the image, if above this threshold, it will by default fallback to file-loader.

##### File-Loader
> will copy files to the build folder and insert links to them where they are included. [read more](https://github.com/webpack-contrib/file-loader)

A handy fallback to `url-loader`. It will try to base64 small images, if the image is not small enough for that, it will copy the image over to the output path and generate the correct url path so the image can be included in your app.

#### SourceMap - Not a loader, but a feature of webpack we should enable in development
When we're running our app and need to do some debugging of styling, it helps to know where in our css and scss files the style rules are from. Source Maps are what provide that in the browser and we can enable them in webpack by adding a `devtool` property inside our webpack.config.js. [read more](https://webpack.js.org/configuration/devtool/) about devtool and source maps.
```
# webpack.config.js

devtool: 'eval-source-map',
```
**NOTE:** I've only gotten the source maps to show up on Chrome. Not sure why FF not listing sourceMaps correctly.

### Updated Webpack Config for Sass support, images, source maps
```
# webpack.config.js

var path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './src/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js'
    },
    mode:'development',
    devtool: 'eval-source-map',
    module : {
        rules : [
            {
              test: /\.m?jsx?$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
                }
              }
            },
            // Using both Pure CSS: import './index.scss'
            {
              test: /\.(sa|sc|c)ss$/i,
              exclude: /\.module\.(sa|sc|c)ss$/i,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
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
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
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
            template : './src/public/index.html'
        })
    ]
}
```

## Production Build

Congratulations! By now you should be able to develop your application. We've setup webpack, several loaders, and plugins. You should have a rudimentary understanding of webpack that hopefully will provide you with a foundation to take the next leap. One lingering question is, how to bundle for production? I personally, like to have my production setup early on so that I can continously ship code. What's the point of learning and developing locally if we can't share our creations in a production environment?

So there are a couple things involved in doing this. First, we need to tell webpack to bundle and transpile our code for production, that means optimizing and minifying it so our bundles *load faster*. It also means *fingerprinting* files so that the browser knows when we've made changes.

One solution is to create multiple webpack.config.js files: one for production, one for development. But there is a lot of overlapping configuration that applies to both production and development. A better solution...

#### webpack-merge
> webpack-merge provides a merge function that concatenates arrays and merges objects creating a new object. [read more](https://github.com/survivejs/webpack-merge)
```
yarn add -D webpack-merge
```
This handy tool will merge configuration objects to create a new configuration object. Common configuration will be inside of `webpack.common.js` and then we'll create two separate files `webpack.prod.js` and `webpack.dev.js`. Each will require the `webpack.common.js` and use `webpack-merge` to join our common configuration with our configuration specific to that environment.

### Minification in production
#### Why minify?
To convert your code into a smaller form that takes up less bytes and thereby loads faster on the browser.

#### Tools for this job
##### mini-css-extract-plugin
> This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps. [read more](https://webpack.js.org/plugins/mini-css-extract-plugin/)

The benefit off this handy plugin is it creates a separate css file that can be loaded in parallel to the javascript, so is ideal in production. **Note:** Cannot be used with style-loader, which is incompatible.

##### optimize-css-assets-webpack-plugin
> A Webpack plugin to optimize \ minimize CSS assets. [read more](https://github.com/NMFR/optimize-css-assets-webpack-plugin)

##### terser-webpack-plugin
UglifyJS is a popular older minifier, but today, the new kid on the block is terser - an actively maintained fork of Uglify-es. Webpack in *production mode* minifies using terser by default. Webpack includes the plugin behind the scenes if you only add the `-p` flag to the webpack command. Including the plugin manually, however, you can configure it how you like. Plus it's more explicit knowing what exactly you are doing. [read more](https://www.npmjs.com/package/terser-webpack-plugin)

```
yarn add -D terser-webpack-plugin optimize-css-assets-webpack-plugin mini-css-extract-plugin
```

### Webpack Mode
We haven't talked about webpack *mode* much, but here is the gist of it. Development tells webpack to run our application with `NODE_ENV` set to development, enables debugging, devtools (source maps). Production sets `NODE_ENV` to production and runs some handy defaults for optimizing for production environments, like minifying your JS. In the command line you can add these flags:

-d shortcut for --debug --devtool eval-cheap-module-source-map --output-pathinfo
-p shortcut for --optimize-minimize --define process.env.NODE_ENV="production"

***NOTE:***
--optimize-minimize will include TerserPlugin behind the scenes. 
--define process.env.NODE_ENV="'production'" will do the same for the DefinePlugin.

***One important caveat that confuses many:*** -p sets the NODE_ENV *inside* your application, but not inside your webpack.config.js. Therefore you cannot use conditionals inside your config like process.env.NODE_ENV === 'production' because they will not work. [see](https://github.com/webpack/webpack/issues/2537)

Use webpack [environment variables](https://webpack.js.org/guides/environment-variables/) instead.

### Updated webpack config files and package.json 'scripts'
```
# webpack.prod.js

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => merge(common(env), {
  mode:'production',
  devtool:'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
})
```

```
# webpack.dev.js

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => merge(common(env), {
  mode: 'development',
  devtool: 'eval-source-map',
})

```

```
# webpack.common.js

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
                    presets: ['@babel/preset-env', '@babel/preset-react']
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
```
```
# package.json
{
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "start:dev": "node_modules/.bin/webpack-dev-server --env.production=0 -d --config webpack.dev.js --open --hot",
    "dev": "node_modules/.bin/webpack --env.production=0 -d --config webpack.dev.js",
    "build": "node_modules/.bin/webpack --env.production -p --config webpack.prod.js --progress",
    "serve": "node_modules/.bin/http-server ./dist",
    
  }, 
}
```
