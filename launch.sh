#!/bin/bash
# Vue AI Chat 启动脚本
# 给这个文件执行权限: chmod +x launch.sh

cd "$(dirname "$0")"

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 找不到 Node.js。请从 https://nodejs.org 安装"
    exit 1
fi

# 检查是否已安装 Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ 找不到 Python 3。请从 https://www.python.org 安装"
    exit 1
fi

# 检查 npm 依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 启动后端服务器
echo "🚀 启动服务器..."
npm run server &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 打开浏览器
echo "🌐 打开应用..."
open http://localhost:5173

# 等待用户关闭
wait $SERVER_PID
