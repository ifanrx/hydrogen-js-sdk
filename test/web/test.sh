#!/bin/bash

cd `dirname $0` && cd ../../
mocha() {
  ./node_modules/.bin/mocha "$@"
}
base_path=./test/web
mocha ${base_path}/index.js
mocha ${base_path}/**/*.test.js
mocha ${base_path}/*.test.js
mocha ${base_path}/windowManager/getAuthModalElement.isolation.js

