#!/bin/bash

# 确保使用 Node.js v20 版本
if command -v nvm &> /dev/null; then
    nvm use v20.0.0
    if [ $? -ne 0 ]; then
        echo "无法切换到 Node.js v20.0.0，请手动安装该版本"
        exit 1
    fi
else
    # 检查当前 node 版本
    NODE_VERSION=$(node -v)
    if [[ ! $NODE_VERSION =~ ^v20 ]]; then
        echo "当前 Node.js 版本不是 v20.x.x: $NODE_VERSION"
        echo "请安装 nvm 并使用 nvm install v20.0.0 安装正确版本"
        exit 1
    fi
fi

echo "使用 Node.js $(node -v)"
echo "启动应用服务器..."

# 启动应用
node server.js 