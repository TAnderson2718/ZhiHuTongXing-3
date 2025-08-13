#!/bin/bash

# 腾讯云Lighthouse服务器部署脚本
# 在目标服务器上运行此脚本

set -e

echo "🖥️ 腾讯云Lighthouse服务器部署脚本"
echo "====================================="

# 配置变量
TCR_REGISTRY="tcr-zhihutongxing.tencentcloudcr.com"
TCR_USERNAME="100019031671"
FULL_IMAGE_NAME="${TCR_REGISTRY}/project-zhihutongxing/app-zhihutongxing"
CONTAINER_NAME="zhihutongxing"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，正在安装..."
    # 安装Docker（适用于Ubuntu/Debian）
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker安装完成，请重新登录后再运行此脚本"
    exit 0
fi

echo "✅ Docker已安装"

# 1. 登录腾讯云TCR
echo "🔐 登录腾讯云TCR..."
echo "请输入TCR密码（JWT Token）："
docker login ${TCR_REGISTRY} --username ${TCR_USERNAME}

if [ $? -eq 0 ]; then
    echo "✅ TCR登录成功"
else
    echo "❌ TCR登录失败"
    exit 1
fi

# 2. 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull ${FULL_IMAGE_NAME}:latest

# 3. 停止并删除旧容器
echo "🛑 停止旧容器..."
docker stop ${CONTAINER_NAME} 2>/dev/null || echo "容器不存在，跳过停止"
docker rm ${CONTAINER_NAME} 2>/dev/null || echo "容器不存在，跳过删除"

# 4. 运行新容器
echo "🚀 启动新容器..."
docker run -d \
  --name ${CONTAINER_NAME} \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  ${FULL_IMAGE_NAME}:latest

# 5. 等待容器启动
echo "⏳ 等待容器启动..."
sleep 10

# 6. 验证部署
echo "🔍 验证部署状态..."
if docker ps | grep -q ${CONTAINER_NAME}; then
    echo "✅ 容器运行正常"
    
    # 测试HTTP响应
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 应用响应正常"
        echo "🌐 应用地址: http://$(curl -s ifconfig.me):3000"
    else
        echo "⚠️ 应用可能还在启动中，请稍后访问"
    fi
    
    # 显示容器状态
    echo ""
    echo "📊 容器状态："
    docker ps --filter name=${CONTAINER_NAME}
    
    echo ""
    echo "📝 查看日志："
    echo "   docker logs ${CONTAINER_NAME}"
    echo "   docker logs -f ${CONTAINER_NAME}  # 实时日志"
    
else
    echo "❌ 容器启动失败"
    echo "📝 查看错误日志："
    docker logs ${CONTAINER_NAME}
    exit 1
fi

echo ""
echo "🎉 部署完成！"
echo "=================================="
echo "🔧 常用管理命令："
echo "   查看状态: docker ps"
echo "   查看日志: docker logs ${CONTAINER_NAME}"
echo "   重启容器: docker restart ${CONTAINER_NAME}"
echo "   停止容器: docker stop ${CONTAINER_NAME}"
echo "   删除容器: docker rm ${CONTAINER_NAME}"
