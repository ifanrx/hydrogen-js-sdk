#!/bin/bash

cd `dirname $0` && cd ../../
mocha() {
  ./node_modules/.bin/mocha ./test/web/"$@"
}

# 由于 mocha 在跑测试时，每个测试之间并没有隔离环境，
# 为了避免出现互相干扰的情况，有些测试需要单独跑。
pattern_list=(
  "index.js"  # 类似于集成测试，旧版本的测试写法
  "**/*.test.js"  # 新版版的测试写法，能更加方便地进行 mock，以 test.js 作为后缀
  "*.test.js"
  "windowManager/getAuthModalElement.isolation.js" # 必须单独跑的测试，以 isolation.js 作为后缀
)

for pattern in ${pattern_list[@]}; do
  echo =================== pattern: ${pattern} ===================
  mocha $pattern
  [ $? != 0 ] && exit 1
done
exit 0
