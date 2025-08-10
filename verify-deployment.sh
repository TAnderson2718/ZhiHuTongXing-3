#!/bin/bash

# 多架构Docker部署验证脚本
# 用于验证部署是否成功以及架构兼容性

set -e

# 配置变量
CONTAINER_NAME="zhihutongxing-app"
HOST_PORT="3000"
TCR_REGISTRY="zhihutongxing-tcr.tencentcloudcr.com"
PROJECT_NAME="project-zhihutongxing"
APP_NAME="app-zhihutongxing"
IMAGE_TAG="latest"

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

# 检查系统信息
check_system_info() {
    log_info "=== 系统信息 ==="
    log_info "操作系统: $(uname -s)"
    log_info "系统架构: $(uname -m)"
    log_info "内核版本: $(uname -r)"
    
    if command -v docker &> /dev/null; then
        log_info "Docker版本: $(docker --version)"
    else
        log_error "Docker未安装"
        return 1
    fi
    echo ""
}

# 检查容器状态
check_container_status() {
    log_info "=== 容器状态检查 ==="
    
    if docker ps | grep -q "$CONTAINER_NAME"; then
        log_success "容器 $CONTAINER_NAME 正在运行"
        
        # 显示容器详细信息
        log_info "容器详细信息:"
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # 显示容器资源使用情况
        log_info "资源使用情况:"
        docker stats "$CONTAINER_NAME" --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
        
    else
        log_error "容器 $CONTAINER_NAME 未运行"
        
        # 检查是否存在但已停止
        if docker ps -a | grep -q "$CONTAINER_NAME"; then
            log_warning "容器存在但已停止，查看日志:"
            docker logs "$CONTAINER_NAME" --tail 20
        else
            log_error "容器不存在"
        fi
        return 1
    fi
    echo ""
}

# 检查镜像信息
check_image_info() {
    log_info "=== 镜像信息检查 ==="
    
    local image_url="${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}"
    
    if docker images | grep -q "$APP_NAME"; then
        log_success "镜像存在: $image_url"
        
        # 显示镜像详细信息
        local image_id=$(docker images --filter "reference=$image_url" --format "{{.ID}}")
        local image_size=$(docker images --filter "reference=$image_url" --format "{{.Size}}")
        local image_created=$(docker images --filter "reference=$image_url" --format "{{.CreatedAt}}")
        
        log_info "镜像ID: $image_id"
        log_info "镜像大小: $image_size"
        log_info "创建时间: $image_created"
        
        # 检查镜像架构
        local image_arch=$(docker inspect "$image_url" --format='{{.Architecture}}')
        local image_os=$(docker inspect "$image_url" --format='{{.Os}}')
        
        log_info "镜像架构: $image_arch"
        log_info "操作系统: $image_os"
        
        # 验证架构匹配
        local system_arch=$(uname -m)
        case $system_arch in
            x86_64)
                if [ "$image_arch" = "amd64" ]; then
                    log_success "架构匹配: 系统($system_arch) <-> 镜像($image_arch)"
                else
                    log_warning "架构不匹配: 系统($system_arch) <-> 镜像($image_arch)"
                fi
                ;;
            aarch64|arm64)
                if [ "$image_arch" = "arm64" ]; then
                    log_success "架构匹配: 系统($system_arch) <-> 镜像($image_arch)"
                else
                    log_warning "架构不匹配: 系统($system_arch) <-> 镜像($image_arch)"
                fi
                ;;
            *)
                log_warning "未知系统架构: $system_arch"
                ;;
        esac
        
    else
        log_error "镜像不存在: $image_url"
        return 1
    fi
    echo ""
}

# 检查网络连接
check_network_connectivity() {
    log_info "=== 网络连接检查 ==="
    
    # 检查端口监听
    if netstat -tuln 2>/dev/null | grep -q ":$HOST_PORT " || ss -tuln 2>/dev/null | grep -q ":$HOST_PORT "; then
        log_success "端口 $HOST_PORT 正在监听"
    else
        log_error "端口 $HOST_PORT 未监听"
        return 1
    fi
    
    # 检查HTTP响应
    log_info "测试HTTP连接..."
    if curl -f -s -m 10 "http://localhost:$HOST_PORT" > /dev/null; then
        log_success "HTTP连接正常"
        
        # 获取响应头信息
        log_info "HTTP响应头:"
        curl -I -s -m 10 "http://localhost:$HOST_PORT" | head -5
        
    else
        log_error "HTTP连接失败"
        
        # 尝试telnet测试端口
        if command -v telnet &> /dev/null; then
            log_info "尝试telnet测试端口..."
            timeout 5 telnet localhost "$HOST_PORT" 2>/dev/null && log_info "端口可达" || log_warning "端口不可达"
        fi
        
        return 1
    fi
    echo ""
}

# 检查应用健康状态
check_application_health() {
    log_info "=== 应用健康检查 ==="
    
    # 检查容器日志中的错误
    log_info "检查容器日志..."
    local error_count=$(docker logs "$CONTAINER_NAME" --since 5m 2>&1 | grep -i "error\|exception\|failed" | wc -l)
    
    if [ "$error_count" -eq 0 ]; then
        log_success "近5分钟内无错误日志"
    else
        log_warning "发现 $error_count 条错误日志"
        log_info "最近的错误日志:"
        docker logs "$CONTAINER_NAME" --since 5m 2>&1 | grep -i "error\|exception\|failed" | tail -5
    fi
    
    # 检查内存使用
    local mem_usage=$(docker stats "$CONTAINER_NAME" --no-stream --format "{{.MemPerc}}" | sed 's/%//')
    if (( $(echo "$mem_usage > 80" | bc -l) )); then
        log_warning "内存使用率较高: ${mem_usage}%"
    else
        log_success "内存使用率正常: ${mem_usage}%"
    fi
    
    echo ""
}

# 性能测试
performance_test() {
    log_info "=== 性能测试 ==="
    
    if command -v curl &> /dev/null; then
        log_info "执行简单性能测试..."
        
        # 测试响应时间
        local response_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:$HOST_PORT")
        log_info "响应时间: ${response_time}s"
        
        if (( $(echo "$response_time < 2.0" | bc -l) )); then
            log_success "响应时间良好"
        else
            log_warning "响应时间较慢"
        fi
        
    else
        log_warning "curl未安装，跳过性能测试"
    fi
    echo ""
}

# 生成验证报告
generate_report() {
    log_info "=== 验证报告 ==="
    
    local report_file="deployment-verification-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "知乎同行多架构Docker部署验证报告"
        echo "生成时间: $(date)"
        echo "系统架构: $(uname -m)"
        echo "Docker版本: $(docker --version)"
        echo ""
        echo "容器信息:"
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
        echo ""
        echo "镜像信息:"
        docker inspect "${TCR_REGISTRY}/${PROJECT_NAME}/${APP_NAME}:${IMAGE_TAG}" --format="架构: {{.Architecture}}, 操作系统: {{.Os}}, 创建时间: {{.Created}}"
        echo ""
        echo "资源使用:"
        docker stats "$CONTAINER_NAME" --no-stream
        echo ""
        echo "最近日志:"
        docker logs "$CONTAINER_NAME" --tail 10
    } > "$report_file"
    
    log_success "验证报告已生成: $report_file"
}

# 主函数
main() {
    log_info "开始多架构Docker部署验证..."
    echo ""
    
    local exit_code=0
    
    check_system_info || exit_code=1
    check_container_status || exit_code=1
    check_image_info || exit_code=1
    check_network_connectivity || exit_code=1
    check_application_health || exit_code=1
    performance_test
    
    if [ $exit_code -eq 0 ]; then
        log_success "=== 验证通过 ==="
        log_success "多架构Docker部署验证成功！"
        log_info "应用访问地址: http://localhost:$HOST_PORT"
    else
        log_error "=== 验证失败 ==="
        log_error "部署验证发现问题，请检查上述错误信息"
    fi
    
    generate_report
    
    return $exit_code
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
