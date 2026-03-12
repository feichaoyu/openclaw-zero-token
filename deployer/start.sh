#!/bin/bash

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

echo "🚀 启动部署向导..."
npm start
