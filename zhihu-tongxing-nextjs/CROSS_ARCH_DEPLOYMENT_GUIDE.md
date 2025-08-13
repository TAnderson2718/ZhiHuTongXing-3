# 🐳 智护童行跨架构Docker部署指南

## 架构说明
- **本地环境**: Mac ARM64 (Apple Silicon)
- **目标服务器**: 腾讯云Lighthouse AMD64 (x86_64)
- **解决方案**: Docker Buildx多架构构建

## 🚀 快速部署步骤

### 第1步：准备工作

1. **确保Docker Desktop运行**
```bash
# 检查Docker状态
docker info
```

2. **登录腾讯云TCR**
```bash
docker login zhihutongxing-tcr.tencentcloudcr.com \
  --username 100019031671 \
  --password [您的TCR密码]
```

### 第2步：选择构建方案

#### 方案A：仅构建AMD64（推荐，更快）
```bash
# 给脚本执行权限
chmod +x build-amd64-only.sh

# 构建并推送AMD64镜像
./build-amd64-only.sh
```

#### 方案B：构建多架构镜像
```bash
# 给脚本执行权限
chmod +x build-and-deploy.sh

# 构建并推送多架构镜像
./build-and-deploy.sh
```

### 第3步：本地测试（可选）
```bash
# 本地测试镜像
chmod +x test-local-build.sh
./test-local-build.sh

# 测试完成后访问 http://localhost:3001
```

### 第4步：服务器部署

在腾讯云Lighthouse服务器上执行：

```bash
# 1. 登录TCR
docker login zhihutongxing-tcr.tencentcloudcr.com \
  --username 100019031671 \
  --password [您的TCR密码]

# 2. 拉取镜像
docker pull zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 3. 停止旧容器（如果存在）
docker stop zhihutongxing 2>/dev/null || true
docker rm zhihutongxing 2>/dev/null || true

# 4. 运行新容器
docker run -d \
  --name zhihutongxing \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 5. 验证部署
docker ps
curl http://localhost:3000
```

## 🔧 技术原理

### Docker Buildx多架构构建
```bash
# 创建多架构构建器
docker buildx create --name multiarch --driver docker-container --use

# 构建指定架构镜像
docker buildx build --platform linux/amd64 --push -t [镜像名] .
```

### 架构兼容性
- `linux/amd64`: 适用于Intel/AMD x86_64处理器
- `linux/arm64`: 适用于ARM64处理器（如Apple Silicon）

## 🛠️ 故障排除

### 常见问题

1. **构建失败：网络超时**
```bash
# 使用国内镜像源
docker buildx build --platform linux/amd64 \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --push -t [镜像名] .
```

2. **推送失败：认证错误**
```bash
# 重新登录TCR
docker logout zhihutongxing-tcr.tencentcloudcr.com
docker login zhihutongxing-tcr.tencentcloudcr.com
```

3. **服务器拉取失败**
```bash
# 检查网络连接
ping zhihutongxing-tcr.tencentcloudcr.com

# 检查认证状态
docker info | grep Registry
```

### 调试命令
```bash
# 查看构建器状态
docker buildx ls

# 查看镜像详细信息
docker buildx imagetools inspect [镜像名]

# 查看容器日志
docker logs zhihutongxing
```

## 📝 最佳实践

1. **构建前测试**: 先运行 `test-local-build.sh` 确保镜像正常
2. **版本标签**: 使用时间戳标签便于回滚
3. **健康检查**: 部署后验证所有功能正常
4. **备份策略**: 保留多个版本的镜像

## 🎯 一键部署命令

如果您想要最简单的部署方式：

```bash
# 在项目根目录执行
chmod +x build-amd64-only.sh && ./build-amd64-only.sh
```

这将自动完成：
- ✅ 设置多架构构建环境
- ✅ 构建AMD64架构镜像
- ✅ 推送到腾讯云TCR
- ✅ 显示部署命令

## 🔐 安全注意事项

1. **TCR密码**: 请妥善保管您的TCR登录密码
2. **环境变量**: 生产环境请设置适当的环境变量
3. **网络安全**: 确保服务器防火墙配置正确
