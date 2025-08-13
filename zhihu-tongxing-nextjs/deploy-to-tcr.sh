#!/bin/bash

# 智护童行一键部署到腾讯云TCR脚本
# 包含完整的登录、构建、推送流程

set -e

echo "🚀 智护童行一键部署到腾讯云TCR"
echo "=================================="

# 配置变量
TCR_REGISTRY="tcr-zhihutongxing.tencentcloudcr.com"
TCR_USERNAME="100019031671"
TCR_PASSWORD="eyJhbGciOiJSUzI1NiIsImtpZCI6IlNZTlA6REpUNjpZUUszOkRJNVY6SlEyQTpVU1JZOjNOR0g6TEdTNzpLVlhYOjQyWU46UDQyRjpRNklPIn0.eyJvd25lclVpbiI6IjEwMDAxOTAzMTY3MSIsIm9wZXJhdG9yVWluIjoiMTAwMDE5MDMxNjcxIiwiZXhwIjoxNzU1MDE4NDA5LCJuYmYiOjE3NTUwMTQ4MDksImlhdCI6MTc1NTAxNDgwOX0.KjUaw-9AJE8igjtzzGiNRw5AB9OoiH3a30p-rFCwGOAQsc6oiJ9xrjTJCJTgOOIp_C-6sF9lyUqtl3r6S0TY32uOTXHp7-6pyZ2xbpTjOvg62n2YBs4AJ4xXj4Ov1oG53-t5XHKSMatBWbslUurqQdFaZ_OVijfwjWpeqoHNBGwAWIakBoFyGDdftgbh_Gie96OBnS6zTpZ22oYbrBrocBfuhvK9XpTBqvoGLaIEvI0O3Wd4RvTBREX3SI3-dL3j9HKzUKTA-X43p7SVfonRARyHiYv9aWZmVLezQwNcKh3QWvg0u7gRVvv4buFIIRi62AdWMFW8Jl84xNEKoX4PbQ"

FULL_IMAGE_NAME="${TCR_REGISTRY}/project-zhihutongxing/app-zhihutongxing"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请启动Docker Desktop"
    exit 1
fi

echo "✅ Docker运行正常"

# 1. 登录腾讯云TCR
echo "🔐 登录腾讯云TCR..."
echo "${TCR_PASSWORD}" | docker login ${TCR_REGISTRY} --username ${TCR_USERNAME} --password-stdin

if [ $? -eq 0 ]; then
    echo "✅ TCR登录成功"
else
    echo "❌ TCR登录失败"
    exit 1
fi

# 2. 设置Docker buildx
echo "🔧 设置Docker buildx..."
docker buildx create --name amd64-builder --driver docker-container --use 2>/dev/null || true
docker buildx inspect --bootstrap

# 3. 构建AMD64架构镜像
echo "🏗️ 构建AMD64架构镜像（适用于腾讯云Lighthouse）..."
docker buildx build \
  --platform linux/amd64 \
  --tag ${FULL_IMAGE_NAME}:latest \
  --tag ${FULL_IMAGE_NAME}:${TIMESTAMP} \
  --push \
  .

echo "✅ 镜像构建并推送完成！"

# 4. 验证镜像
echo "🔍 验证镜像信息..."
docker buildx imagetools inspect ${FULL_IMAGE_NAME}:latest

echo ""
echo "🎉 部署完成！"
echo "=================================="
echo "📋 镜像信息："
echo "   镜像地址: ${FULL_IMAGE_NAME}:latest"
echo "   时间戳版本: ${FULL_IMAGE_NAME}:${TIMESTAMP}"
echo "   架构: linux/amd64"
echo ""
echo "🖥️ 在腾讯云Lighthouse服务器上运行："
echo "   # 登录TCR"
echo "   docker login ${TCR_REGISTRY} --username ${TCR_USERNAME}"
echo ""
echo "   # 拉取镜像"
echo "   docker pull ${FULL_IMAGE_NAME}:latest"
echo ""
echo "   # 停止旧容器"
echo "   docker stop zhihutongxing 2>/dev/null || true"
echo "   docker rm zhihutongxing 2>/dev/null || true"
echo ""
echo "   # 运行新容器"
echo "   docker run -d \\"
echo "     --name zhihutongxing \\"
echo "     -p 3000:3000 \\"
echo "     --restart unless-stopped \\"
echo "     -e NODE_ENV=production \\"
echo "     ${FULL_IMAGE_NAME}:latest"
echo ""
echo "   # 验证部署"
echo "   docker ps"
echo "   curl http://localhost:3000"
