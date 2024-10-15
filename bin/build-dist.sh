#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PATH="${DIR}/../node_modules/.bin:${PATH}"

if [ -n "$1" -a -f "$1" ];then
  webpack_config="$1"
else
  webpack_config="${DIR}/../webpack/cjs/webpack-base.config.js"
fi

dist=$(realpath ./dist)

[ -d "$dist" ] && rm -rf "$dist"

# es2020/esm
webpack --config "$webpack_config" --env target=es2020 --env module=esm

# es2020/cjs
webpack --config "$webpack_config" --env target=es2020 --env module=cjs

# es2020/web
webpack --config "$webpack_config" --env target=es2020 --env module=web

# es5/web
webpack --config "$webpack_config" --env target=es5 --env module=web

node "${DIR}/update_pkg_json.js"
