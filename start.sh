#!/bin/bash

echo "========================================"
echo "海洋教育后台管理系统启动脚本"
echo "========================================"
echo

echo "正在检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js环境，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "Node.js环境检查通过"
echo "Node.js版本: $(node --version)"
echo

echo "正在检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "未检测到node_modules目录，正在安装依赖..."
    echo "这可能需要几分钟时间，请耐心等待..."
    
    if command -v yarn &> /dev/null; then
        echo "使用yarn安装依赖..."
        yarn install
    else
        echo "使用npm安装依赖..."
        npm install
    fi
    
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接"
        exit 1
    fi
    
    echo "依赖安装完成"
else
    echo "依赖检查通过"
fi

echo
echo "正在启动开发服务器..."
echo "服务器将在 http://localhost:3000 启动"
echo "请稍等片刻..."
echo

if command -v yarn &> /dev/null; then
    yarn dev
else
    npm run dev
fi