#!/usr/bin/env bash

tmp_dir=./scripts/tmp

getConfigFilePath() {
  platform=$1
  echo ./jsdoc-configs/types-cp-$platform.json
}

getPlatformNamespace() {
  platform=$1
  case $platform in
    wechat) echo WechatMiniprogram;;
    *) echo PlatformNamespace;;
  esac
}

getBaaSNamespace() {
  platform=$1
  case $platform in
    wechat) echo WechatBaaS;;
    qq) echo QqBaaS;;
    baidu) echo BaiduBaaS;;
    alipay) echo AlipayBaaS;;
    web) echo WebBaaS;;
    *) exit 1;;
  esac
}

getInterface() {
  platform=$1
  case $platform in
    wechat) echo Wx;;
    qq) echo Qq;;
    baidu) echo Swan;;
    alipay) echo My;;
    web) echo Window;;
    *) exit 1;;
  esac
}

getVarName() {
  platform=$1
  case $platform in
    wechat) echo wx;;
    qq) echo qq;;
    baidu) echo swan;;
    alipay) echo my;;
    web) echo window;;
    *) exit 1;;
  esac
}

buildTypes() {
  platform=$1
  dest=$tmp_dir/$platform/baas.d.ts
  config=`getConfigFilePath $platform`

  # build *.d.ts
  ./node_modules/.bin/jsdoc -c $config -d $dest

  # 将各个平台的 BaaS 命名空间区分开
  sed -i "s/BaaS/`getBaaSNamespace $platform`/g" $dest

  # 将 BaaS 暴露到各个平台的某个变量下
  if [ $platform != "web" ];then
    echo "
declare namespace `getPlatformNamespace $platform` {
    interface `getInterface $platform` {
    /**
    * 知晓云 SDK 命名空间
    */
    BaaS: typeof `getBaaSNamespace $platform`;
  }
}
" >> $dest
    echo "declare const `getVarName $platform`: `getPlatformNamespace $platform`.`getInterface $platform`" >> $dest

  else
    echo "
interface Window {
    /**
    * 知晓云 SDK 命名空间
    */
    BaaS: typeof `getBaaSNamespace $platform`;
}
declare var window: Window & typeof globalThis
" >> $dest
  fi

  # 移除 ^M (\r)
  sed -i $'s/\r//' $dest

  # Promise.<WechatBaaS.Response.<any>>  --->   Promise<WechatBaaS.Response<any>>
  sed -i "s/\.\(<\)/\1/g" $dest
  echo $dest
}

# build 出一份包含多个平台代码的 d.ts 文件
buildTypesForCrossPlatform() {
  platforms=(wechat qq baidu alipay web)

  # 判断平台名称是否有效（是否有对应的配置）
  for platform in ${platforms[*]}; do
    if [ ! -f `getConfigFilePath $platform` ]; then
      echo "error: invalid platform name - ${platform}"
      exit 1
    fi
  done

  # build
  i=0
  for platform in ${platforms[*]}; do
    echo Generated $platform baas.d.ts file
    filepaths[$i]=`buildTypes $platform`
    echo ${filepaths[i]} | grep -q "^error: "
    if [ $? -ne 1 ]; then
      echo ${filepaths[i]}
      exit 1
    fi
    let i+=1
  done

  # merge
  j=0
  dest=./types/baas.d.ts
  for filepath in ${filepaths[*]}; do
    if [ $j -eq 0 ]; then
      echo -e "/******************************************************\n${platforms[j]}\n******************************************************/\n" > $dest
    else
      echo -e "\n\n\n/******************************************************\n${platforms[j]}\n******************************************************/\n" >> $dest
    fi
    cat $filepath >> $dest
    let j+=1
  done

  rm -rf $tmp_dir
}

buildTypesForCrossPlatform

# 将 build 出来的文件移动到测试项目的目录下
if [ "$1" != "" ];then
  echo copy *.d.ts file to $1
  cp $dest $1
fi
