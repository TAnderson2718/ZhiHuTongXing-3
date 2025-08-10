#!/bin/bash

# 多架构Docker镜像部署脚本
# 支持AMD64和ARM64架构的自动部署

set -e

# 配置变量
TCR_REGISTRY="zhihutongxing-tcr.tencentcloudcr.com"
PROJECT_NAME="project-zhihutongxing"
APP_NAME="app-zhihutongxing"
IMAGE_TAG="latest"
CONTAINER_NAME="zhihutongxing-app"
HOST_PORT="3000"
CONTAINER_PORT="3000"

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

# 检查Docker是否安装
check_docker() {
    log_info "检查Docker环境..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker服务未运行，请启动Docker服务"
        exit 1
    fi
    
    log_success "Docker环境检查通过"
}

# 检查系统架构
check_architecture() {
    ARCH=$(uname -m)
    log_info "检测到系统架构: $ARCH"
    
    case $ARCH in
        x86_64)
            log_info "系统架构: AMD64"
            ;;
        aarch64|arm64)
            log_info "系统架构: ARM64"
            ;;
        *)
            log_warning "未知架构: $ARCH，将尝试使用多架构镜像"
            ;;
    esac
}

# 登录TCR
login_tcr() {
    log_info "登录腾讯云容器镜像服务..."
    
    if [ -z "$TCR_USERNAME" ] || [ -z "$TCR_PASSWORD" ]; then
        log_error "请设置环境变量 TCR_USERNAME 和 TCR_PASSWORD"
        log_info "使用方法: export TCR_USERNAME=your_username && export TCR_PASSWORD=your_password"
        exit 1
    fi
    
    echo "$TCR_PASSWORD" | docker login "$TCR_REGISTRY" --username "$TCR_USERNAME" --password-stdin
    log_success "TCR登录成功"
}

# 停止并删除旧容器
cleanup_old_container() {
    log_info "清理旧容器..."
    
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log_info "停止运行中的容器: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME"
    fi
    
    if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
        log_info "删除旧容器: $CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
    fi
    
    log_success "旧容器清理完成"
}

# 拉取多架构镜像
pull_image() {
    local image_url="${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}"
    
    log_info "拉取多架构Docker镜像..."
    log_info "镜像地址: $image_url"
    
    docker pull "$image_url"
    
    # 验证镜像架构
    log_info "验证镜像架构信息..."
    PULLED_ARCH=$(docker inspect "$image_url" --format='{{.Architecture}}')
    log_success "成功拉取镜像，架构: $PULLED_ARCH"
}

# 运行新容器
run_container() {
    local image_url="${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}"
    
    log_info "启动新容器..."
    log_info "容器名称: $CONTAINER_NAME"
    log_info "端口映射: $HOST_PORT:$CONTAINER_PORT"
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "$HOST_PORT:$CONTAINER_PORT" \
        -e NODE_ENV=production \
        "$image_url"
    
    log_success "容器启动成功"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待容器启动
    sleep 10
    
    # 检查容器状态
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        log_error "容器未正常运行"
        docker logs "$CONTAINER_NAME"
        exit 1
    fi
    
    # 检查应用响应
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "健康检查尝试 $attempt/$max_attempts..."
        
        if curl -f -s "http://localhost:$HOST_PORT" > /dev/null; then
            log_success "应用健康检查通过"
            log_success "应用已成功部署，访问地址: http://localhost:$HOST_PORT"
            return 0
        fi
        
        sleep 5
        ((attempt++))
    done
    
    log_error "健康检查失败，应用可能未正常启动"
    log_info "查看容器日志:"
    docker logs "$CONTAINER_NAME"
    exit 1
}

# 显示部署信息
show_deployment_info() {
    log_success "=== 部署完成 ==="
    log_info "容器名称: $CONTAINER_NAME"
    log_info "镜像地址: ${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}"
    log_info "访问地址: http://localhost:$HOST_PORT"
    log_info "系统架构: $(uname -m)"
    log_info "镜像架构: $(docker inspect ${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG} --format='{{.Architecture}}')"
    
    echo ""
    log_info "常用命令:"
    log_info "查看容器状态: docker ps"
    log_info "查看容器日志: docker logs $CONTAINER_NAME"
    log_info "停止容器: docker stop $CONTAINER_NAME"
    log_info "重启容器: docker restart $CONTAINER_NAME"
}

# 主函数
main() {
    log_info "开始多架构Docker镜像部署..."
    
    check_docker
    check_architecture
    login_tcr
    cleanup_old_container
    pull_image
    run_container
    health_check
    show_deployment_info
    
    log_success "多架构Docker镜像部署完成！"
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
