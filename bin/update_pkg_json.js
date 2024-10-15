const fs       = require('fs')
const path     = require('path')
const pkg_path = path.resolve('package.json')
const pkg      = require(pkg_path)

pkg.exports = pkg.exports || {}

pkg.exports = {
  ...pkg.exports,
  ".": {
    ...pkg.exports["."],
    "browser": "./dist/es2020/web/my-app.js",
    "import":  "./dist/es2020/esm/my-app.js",
    "require": "./dist/es2020/cjs/my-app.js"
  },
  "./es2020": {
    ...pkg.exports["./es2020"],
    "browser": "./dist/es2020/web/my-app.js",
    "import":  "./dist/es2020/esm/my-app.js",
    "require": "./dist/es2020/cjs/my-app.js"
  },
  "./es5": {
    ...pkg.exports["./es5"],
    "browser": "./dist/es5/web/my-app.js"
  }
}

pkg.files = pkg.files || []

pkg.files = pkg.files.filter(file => (file.indexOf('dist/') !== 0) && (file.indexOf('./dist/') !== 0))

pkg.files.push('dist/')

fs.writeFileSync(
  pkg_path,
  JSON.stringify(pkg, null, 2),
  {encoding: 'utf8'}
)
