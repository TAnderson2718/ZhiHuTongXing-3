#!/bin/bash

# 本地Docker镜像测试脚本
# 在推送到TCR之前先在本地测试

set -e

echo "🧪 开始本地Docker镜像测试..."

# 配置变量
LOCAL_IMAGE_NAME="zhihutongxing-local"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请启动Docker Desktop"
    exit 1
fi

echo "✅ Docker运行正常"

# 1. 构建本地镜像（ARM64架构）
echo "🏗️ 构建本地测试镜像..."
docker build -t ${LOCAL_IMAGE_NAME}:latest .

echo "✅ 本地镜像构建完成"

# 2. 停止并删除现有容器（如果存在）
echo "🧹 清理现有容器..."
docker stop ${LOCAL_IMAGE_NAME}-test 2>/dev/null || true
docker rm ${LOCAL_IMAGE_NAME}-test 2>/dev/null || true

# 3. 运行测试容器
echo "🚀 启动测试容器..."
docker run -d \
  --name ${LOCAL_IMAGE_NAME}-test \
  -p 3001:3000 \
  -e NODE_ENV=production \
  ${LOCAL_IMAGE_NAME}:latest

# 4. 等待容器启动
echo "⏳ 等待容器启动..."
sleep 10

# 5. 测试容器是否正常运行
echo "🔍 测试容器状态..."
if docker ps | grep -q ${LOCAL_IMAGE_NAME}-test; then
    echo "✅ 容器运行正常"
    
    # 测试HTTP响应
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ HTTP服务正常响应"
        echo "🌐 本地测试地址: http://localhost:3001"
        echo ""
        echo "📋 测试完成！可以安全推送到TCR"
        echo "   运行 ./build-amd64-only.sh 构建生产镜像"
    else
        echo "❌ HTTP服务无响应"
        docker logs ${LOCAL_IMAGE_NAME}-test
        exit 1
    fi
else
    echo "❌ 容器启动失败"
    docker logs ${LOCAL_IMAGE_NAME}-test
    exit 1
fi

echo ""
echo "🛑 测试完成后，运行以下命令清理："
echo "   docker stop ${LOCAL_IMAGE_NAME}-test"
echo "   docker rm ${LOCAL_IMAGE_NAME}-test"
echo "   docker rmi ${LOCAL_IMAGE_NAME}:latest"
