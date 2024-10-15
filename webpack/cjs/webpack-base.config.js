const webpack      = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const fs           = require('fs')
const path         = require('path')
const pkg          = require(path.resolve('package.json'))

const validate_pkg = function() {
  if (!pkg)
    throw new Error('package.json is required')

  if (!pkg.config || !pkg.config['build-dist'] || !pkg.config['build-dist'].window || !pkg.config['build-dist'].export)
    throw new Error('package.json does not contain: ' + JSON.stringify({"config": {"build-dist": {"window": "myApp", "export": "my-app"}}}))
}

const validate_env = function(env) {
  if (!env || (typeof env !== 'object'))
    throw new Error('env is not an Object')

  const targets = ['es2020', 'es5']
  if (!env.target || (targets.indexOf(env.target) === -1))
    throw new Error('--env target=value is required, where value is in: ' + JSON.stringify(targets))

  const modules = ['esm', 'cjs', 'web']
  if (!env.module || (modules.indexOf(env.module) === -1))
    throw new Error('--env module=value is required, where value is in: ' + JSON.stringify(modules))
}

module.exports = function(env, argv) {
  validate_pkg()
  validate_env(env)

  let experiments, output, target
  switch(env.module) {
    case 'esm':
      experiments = {
        outputModule: true
      }
      output = {
        clean: true,
        iife: false,
        module: true,
        chunkFormat: "module",
        library: {
          type: "module"
        }
      }
      target = ['node']
      break
    case 'cjs':
      experiments = {
        outputModule: true
      }
      output = {
        clean: true,
        iife: false,
        chunkFormat: "commonjs",
        library: {
          type: "commonjs2"
        }
      }
      target = ['node']
      break
    case 'web':
      output = {
        clean: true,
        iife: true,
        library: {
          name: pkg.config['build-dist'].window,
          type: "window"
        }
      }
      target = ['web']
      break
  }

  experiments = experiments || {}
  output = {
    ...output,
    path: path.resolve('dist', env.target, env.module),
    filename: (pkg.config['build-dist'].export + '.js'),
    sourceMapFilename: (pkg.config['build-dist'].export + '.map')
  }
  target.push(env.target)

  return {
    entry: path.resolve('src', 'index.js'),
    experiments,
    output,
    target,
    mode: 'production',
    devtool: 'source-map',
    resolve: {
      modules: [
        path.resolve('src'),
        path.resolve('webpack', env.module),
        path.resolve('webpack'),
        path.resolve('node_modules')
      ],
      fallback: {
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: path.resolve(__dirname, '..', '..', 'node_modules', 'babel-loader'),
            options: {
              presets: [
                path.resolve(__dirname, '..', '..', 'node_modules', '@babel', 'preset-env')
              ]
            }
          }
        }
      ]
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false
    },
    optimization: {
      nodeEnv: 'production',
      concatenateModules: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            compress: true,
            sourceMap: true
          }
        }),
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify((env.dev || env.development) ? 'development' : 'production')
        }
      }),
      {
        apply: function(compiler) {
          compiler.hooks.done.tap('build-dist', function() {
            let type
            switch(env.module) {
              case 'esm':
                type = 'module'
                break
              case 'cjs':
                type = 'commonjs'
                break
            }

            if (type) {
              fs.writeFileSync(
                path.resolve('dist', env.target, env.module, 'package.json'),
                JSON.stringify({type}, null, 2),
                {encoding: 'utf8'}
              )
            }
          })
        }
      }
    ]
  }
}
