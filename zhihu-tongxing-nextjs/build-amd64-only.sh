#!/bin/bash

# 智护童行AMD64架构Docker镜像构建脚本
# 专门为腾讯云Lighthouse AMD64服务器构建

set -e

echo "🚀 开始构建AMD64架构Docker镜像..."

# 配置变量（根据您的TCR信息更新）
IMAGE_NAME="zhihutongxing"
TCR_REGISTRY="tcr-zhihutongxing.tencentcloudcr.com"
TCR_NAMESPACE="project-zhihutongxing"
TCR_REPO="app-zhihutongxing"
FULL_IMAGE_NAME="${TCR_REGISTRY}/${TCR_NAMESPACE}/${TCR_REPO}"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请启动Docker Desktop"
    exit 1
fi

echo "✅ Docker运行正常"

# 1. 设置Docker buildx
echo "🔧 设置Docker buildx..."
docker buildx create --name amd64-builder --driver docker-container --use 2>/dev/null || true
docker buildx inspect --bootstrap

# 2. 仅构建AMD64架构镜像（更快）
echo "🏗️ 构建AMD64架构镜像..."
docker buildx build \
  --platform linux/amd64 \
  --tag ${FULL_IMAGE_NAME}:latest \
  --tag ${FULL_IMAGE_NAME}:amd64-$(date +%Y%m%d-%H%M%S) \
  --push \
  .

echo "✅ AMD64镜像构建并推送完成！"

# 3. 验证镜像
echo "🔍 验证镜像信息..."
docker buildx imagetools inspect ${FULL_IMAGE_NAME}:latest

echo "🎉 构建完成！镜像已推送到腾讯云TCR"
echo ""
echo "📋 部署信息："
echo "   镜像地址: ${FULL_IMAGE_NAME}:latest"
echo "   架构: linux/amd64"
echo ""
echo "🖥️ 在目标服务器上运行以下命令部署："
echo "   docker login ${TCR_REGISTRY} --username 100019031671"
echo "   docker pull ${FULL_IMAGE_NAME}:latest"
echo "   docker run -d -p 3000:3000 --name zhihutongxing ${FULL_IMAGE_NAME}:latest"
