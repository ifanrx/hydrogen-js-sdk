#!/usr/bin/env bash

dest=./types/baas-wx.d.ts
config=./jsdoc-configs/types-wechat.json

# build *.d.ts
./node_modules/.bin/jsdoc -c $config -d $dest
echo Generated *.d.ts file

echo "
declare namespace wx {
    interface Wx {
        /**
         * 知晓云 SDK 命名空间
         */
        BaaS: typeof BaaS;
    }
}
" >> $dest

sed -i "" $'s/\r//' $dest  # 移除 ^M (\r)
