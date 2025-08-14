#!/bin/bash

# 修复后重新构建和部署脚本

set -e

# 配置变量
TCR_REGISTRY="zhihutongxing-tcr.tencentcloudcr.com"
PROJECT_NAME="project-zhihutongxing"
APP_NAME="app-zhihutongxing"
IMAGE_TAG="latest"
LOCAL_IMAGE_NAME="zhihutongxing-app-fixed"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 进入项目目录
cd "$(dirname "$0")/zhihu-tongxing-nextjs"

log_info "开始构建修复后的Docker镜像..."

# 构建本地镜像
log_info "构建本地镜像: $LOCAL_IMAGE_NAME"
docker build -t "$LOCAL_IMAGE_NAME" .

log_success "本地镜像构建完成"

# 标记镜像为TCR格式
TCR_IMAGE_URL="${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}"
log_info "标记镜像: $TCR_IMAGE_URL"
docker tag "$LOCAL_IMAGE_NAME" "$TCR_IMAGE_URL"

log_info "镜像准备完成，准备推送到TCR..."
log_info "请确保已设置环境变量 TCR_USERNAME 和 TCR_PASSWORD"

# 检查环境变量
if [ -z "$TCR_USERNAME" ] || [ -z "$TCR_PASSWORD" ]; then
    log_error "请设置环境变量:"
    echo "export TCR_USERNAME=your_username"
    echo "export TCR_PASSWORD=your_password"
    exit 1
fi

# 登录TCR
log_info "登录TCR..."
echo "$TCR_PASSWORD" | docker login "$TCR_REGISTRY" --username "$TCR_USERNAME" --password-stdin

# 推送镜像
log_info "推送镜像到TCR..."
docker push "$TCR_IMAGE_URL"

log_success "镜像推送完成！"

# 在服务器上重新部署
log_info "连接服务器重新部署..."

ssh server-zhihutongxing "cd /home/ubuntu/zhihutongxing-multiarch-deploy && export TCR_USERNAME=$TCR_USERNAME && export TCR_PASSWORD=$TCR_PASSWORD && ./deploy-multiarch.sh"

log_success "部署完成！"

# 验证部署
log_info "验证部署状态..."
ssh server-zhihutongxing "cd /home/ubuntu/zhihutongxing-multiarch-deploy && ./verify-deployment.sh"

log_success "重新构建和部署完成！"
