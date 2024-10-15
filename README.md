### [_build-dist_](https://github.com/warren-bank/node-build-dist)

Opinionated build tool for hybrid NPM modules.

- - - -

#### Conventions (Input)

##### Source directory structure:

```
  package.json
  src/index.js
```

##### Optional directories for mock modules:

```
  webpack/
  webpack/cjs/
  webpack/esm/
  webpack/web/
```

where:

* `cjs/`, `esm/`, `web/`
  - only resolve for the corresponding build target

##### _Package.json_ configuration:

```
  {
    "config": {
      "build-dist": {
        "window": "myApp",
        "export": "my-app"
      }
    }
  }
```

where:

* `config["build-dist"]["window"]`
  - is the name of the global variable used by browser builds
* `config["build-dist"]["export"]`
  - is the filename (without extension) used by all build targets

- - - -

#### Conventions (Output)

##### _Dist_ directory structure:

```
  dist
  +---es2020
  |   +---cjs
  |   |       my-app.js
  |   |       my-app.map
  |   |       package.json
  |   |
  |   +---esm
  |   |       my-app.js
  |   |       my-app.map
  |   |       package.json
  |   |
  |   \---web
  |           my-app.js
  |           my-app.map
  |
  \---es5
      \---web
              my-app.js
              my-app.map
```

##### _Package.json_ injection:

```
  {
    "exports": {
      ".": {
        "browser": "./dist/es2020/web/my-app.js",
        "import": "./dist/es2020/esm/my-app.js",
        "require": "./dist/es2020/cjs/my-app.js"
      },
      "./es2020": {
        "browser": "./dist/es2020/web/my-app.js",
        "import": "./dist/es2020/esm/my-app.js",
        "require": "./dist/es2020/cjs/my-app.js"
      },
      "./es5": {
        "browser": "./dist/es5/web/my-app.js"
      }
    },
    "files": [
      "dist/"
    ]
  }
```

- - - -

#### Installation

```bash
  npm install --global "@warren-bank/build-dist"
```

#### Usage

```bash
  cd /path/to/project

  build-dist [webpack_config_filepath]
```

where:

* `webpack_config_filepath`
  - is optional
  - must extend: `@warren-bank/build-dist/webpack`
    * hybrid module that supports both _commonjs_ and _esm_
    * exports a function

for example:

```javascript
  // webpack.config.js

  const base_config = require('@warren-bank/build-dist/webpack')

  module.exports = function(env, argv) {
    const options = base_config(env, argv)

    if (env.module === 'web') {
      options.externals = {
      }

      options.resolve.fallback = {
      }
    }

    return options
  }
```

#### Legal

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
