#!/bin/bash

# 智护童行最新版跨架构Docker镜像构建和推送脚本
# 适用于Mac ARM64 -> 腾讯云Lighthouse AMD64

set -e

echo "🚀 智护童行最新版跨架构镜像构建和推送流程"
echo "=============================================="

# 配置变量
TCR_REGISTRY="tcr-zhihutongxing.tencentcloudcr.com"
TCR_USERNAME="100019031671"
TCR_PASSWORD="eyJhbGciOiJSUzI1NiIsImtpZCI6IlNZTlA6REpUNjpZUUszOkRJNVY6SlEyQTpVU1JZOjNOR0g6TEdTNzpLVlhYOjQyWU46UDQyRjpRNklPIn0.eyJvd25lclVpbiI6IjEwMDAxOTAzMTY3MSIsIm9wZXJhdG9yVWluIjoiMTAwMDE5MDMxNjcxIiwiZXhwIjoxNzU1MDE4NDA5LCJuYmYiOjE3NTUwMTQ4MDksImlhdCI6MTc1NTAxNDgwOX0.KjUaw-9AJE8igjtzzGiNRw5AB9OoiH3a30p-rFCwGOAQsc6oiJ9xrjTJCJTgOOIp_C-6sF9lyUqtl3r6S0TY32uOTXHp7-6pyZ2xbpTjOvg62n2YBs4AJ4xXj4Ov1oG53-t5XHKSMatBWbslUurqQdFaZ_OVijfwjWpeqoHNBGwAWIakBoFyGDdftgbh_Gie96OBnS6zTpZ22oYbrBrocBfuhvK9XpTBqvoGLaIEvI0O3Wd4RvTBREX3SI3-dL3j9HKzUKTA-X43p7SVfonRARyHiYv9aWZmVLezQwNcKh3QWvg0u7gRVvv4buFIIRi62AdWMFW8Jl84xNEKoX4PbQ"

PROJECT_NAME="project-zhihutongxing"
APP_NAME="app-zhihutongxing"
FULL_IMAGE_NAME="${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker环境
check_docker() {
    log_info "检查Docker环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker Desktop"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker服务未运行，请启动Docker Desktop"
        exit 1
    fi
    
    log_success "Docker环境检查通过"
}

# 登录TCR
login_tcr() {
    log_info "登录腾讯云容器镜像服务..."
    
    echo "${TCR_PASSWORD}" | docker login "${TCR_REGISTRY}" --username "${TCR_USERNAME}" --password-stdin
    
    if [ $? -eq 0 ]; then
        log_success "TCR登录成功"
    else
        log_error "TCR登录失败"
        exit 1
    fi
}

# 设置Docker buildx
setup_buildx() {
    log_info "设置Docker buildx多架构构建环境..."
    
    # 创建或使用现有的buildx实例
    docker buildx create --name multiarch-builder --driver docker-container --use 2>/dev/null || \
    docker buildx use multiarch-builder 2>/dev/null || true
    
    # 启动并检查buildx
    docker buildx inspect --bootstrap
    
    log_success "Docker buildx设置完成"
}

# 构建并推送多架构镜像
build_and_push() {
    log_info "开始构建跨架构Docker镜像..."
    log_info "目标架构: linux/amd64, linux/arm64"
    log_info "镜像地址: ${FULL_IMAGE_NAME}"
    
    # 构建并推送多架构镜像
    docker buildx build \
        --platform linux/amd64,linux/arm64 \
        --tag "${FULL_IMAGE_NAME}:latest" \
        --tag "${FULL_IMAGE_NAME}:${TIMESTAMP}" \
        --push \
        .
    
    log_success "镜像构建并推送完成！"
}

# 验证镜像
verify_image() {
    log_info "验证镜像信息..."
    
    docker buildx imagetools inspect "${FULL_IMAGE_NAME}:latest"
    
    log_success "镜像验证完成"
}

# 显示部署信息
show_deployment_info() {
    echo ""
    log_success "=== 构建推送完成 ==="
    log_info "镜像地址: ${FULL_IMAGE_NAME}:latest"
    log_info "时间戳版本: ${FULL_IMAGE_NAME}:${TIMESTAMP}"
    log_info "支持架构: linux/amd64, linux/arm64"
    
    echo ""
    log_info "🖥️ 在腾讯云服务器上部署命令："
    echo "   # 登录TCR"
    echo "   docker login ${TCR_REGISTRY} --username ${TCR_USERNAME}"
    echo ""
    echo "   # 拉取最新镜像"
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
}

# 主函数
main() {
    log_info "开始智护童行跨架构镜像构建和推送..."
    
    check_docker
    login_tcr
    setup_buildx
    build_and_push
    verify_image
    show_deployment_info
    
    log_success "🎉 跨架构镜像构建和推送完成！"
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
