#!/usr/bin/env bash

lockfile=./scripts/lock

trap "rm $lockfile;exit" 2

# 锁定，不允许并发运行该脚本
if [ -f $lockfile ]; then
  exit 0
fi

touch $lockfile

./scripts/gen-types-wechat.sh
./scripts/gen-types-cross-platform.sh $1

rm $lockfile
