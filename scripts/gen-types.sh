#!/usr/bin/env bash

# 选择平台
if [ "$1" == "wechat" ];then
  dest=./types/baas-wx.d.ts
  config=./jsdoc-configs/types-wechat.json
else
  echo "Please select platform"
  exit 1
fi

# build *.d.ts
./node_modules/.bin/jsdoc -c $config -d $dest
echo Generated *.d.ts file of $1

sed -i '' 's/^/    /g' $dest

sed -i '' '1i\
declare namespace wx {
' $dest
sed -i '' '$i\
}' $dest

# 将 'Class<xxx>' 转换为 Typescript 的 'typeof xxx'
# sed -i "" "s/Class\<\(.*\)\>/typeof \1/g" $dest

# 将 build 出来的文件移动到测试项目的目录下
if [ "$2" != "" ];then
  echo copy *.d.ts file to $2
  cp $dest $2
fi

