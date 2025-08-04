# 智护童行多架构Docker镜像部署指南

## 概述
由于本地网络连接问题阻止了直接的多架构Docker构建，我们采用GitHub Actions作为替代方案来构建支持ARM64和AMD64架构的Docker镜像。

## 解决方案架构

### 问题分析
1. **架构不匹配**: 本地Mac（ARM64）构建的镜像无法在生产服务器（AMD64）上运行
2. **网络连接问题**: Docker Hub和腾讯云镜像源连接超时
3. **构建环境限制**: 本地环境无法完成多架构构建

### 解决方案
使用GitHub Actions进行多架构Docker镜像构建：
- 利用GitHub的云基础设施和稳定网络连接
- 支持同时构建ARM64和AMD64架构
- 自动推送到腾讯云TCR

## 设置步骤

### 1. 配置GitHub Secrets
在GitHub仓库中设置以下Secrets：

1. 进入GitHub仓库 → Settings → Secrets and variables → Actions
2. 添加以下Repository secrets：

```
TCR_USERNAME: 100019031671
TCR_PASSWORD: eyJhbGciOiJSUzI1NiIsImtpZCI6IkUyVE46SVNIQjpYSkZQOjVaNEE6UDRUSjpFSU9DOkZTSkQ6UjQ2RTpCWUw1OktBNDU6WkZPSzpCVjJNIn0.eyJvd25lclVpbiI6IjEwMDAxOTAzMTY3MSIsIm9wZXJhdG9yVWluIjoiMTAwMDE5MDMxNjcxIiwidG9rZW5JZCI6ImQyOGN0cDcxbjNiNTQ1NThrazkwIiwiZXhwIjoyMDY5NjgwNjEyLCJuYmYiOjE3NTQzMjA2MTIsImlhdCI6MTc1NDMyMDYxMn0.A7POD7RyXeVghPzRG8wzrbQ0P_dr2s67TtKH61JDhFeclbcbMpoYQu0R-FVQxt_PubrZd2v8rFAyEMA4Aq-YUaMCW8gZ3GbWjiy2qD3Uq6rP-5L3vwdZRb3sMokaBgIzaDQRIZTswH9Id_PMclqou8iAJvGh1p0-E7djdOoJnI33tExocNh4sijj6WI3voS3AA6YnFIR5ZNHcCovb0KggRrh8AzVuA8EPXYnxfJipDMKue13OIiw-du6Q0DxgSVqAJeXuxIT4R42FYUR6xnXwNU-JEVE4yKHHSw2UN_8qjfkmcbknnTbUGdUWmrz3jSb_jDvIfVqsIx-sMSwLwv_xw
```

### 2. 触发构建
有三种方式触发多架构镜像构建：

#### 方式1: 推送代码（自动触发）
```bash
git add .
git commit -m "Add multi-architecture Docker build"
git push origin main
```

#### 方式2: 手动触发
1. 进入GitHub仓库 → Actions
2. 选择 "Build Multi-Architecture Docker Image" 工作流
3. 点击 "Run workflow" → "Run workflow"

#### 方式3: Pull Request（自动触发）
创建Pull Request时会自动触发构建

### 3. 监控构建过程
1. 进入GitHub仓库 → Actions
2. 查看最新的工作流运行状态
3. 点击具体的运行实例查看详细日志

## 构建产物

### 镜像信息
- **镜像名称**: `zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest`
- **支持架构**: 
  - `linux/amd64` (生产服务器)
  - `linux/arm64` (本地开发)

### 镜像特性
- ✅ 包含所有认证修复（Cookie secure标志设置为false）
- ✅ 基于Node.js 18 Alpine镜像
- ✅ 多架构支持
- ✅ 优化的构建缓存
- ✅ 安全的非root用户运行

## 部署验证

### 在目标服务器上测试
```bash
# SSH连接到服务器
ssh server-zhihutongxing

# 登录TCR
docker login zhihutongxing-tcr.tencentcloudcr.com --username 100019031671 --password [JWT_TOKEN]

# 拉取多架构镜像
docker pull zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 运行容器
docker run -d -p 3000:3000 --name zhihutongxing zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 验证运行状态
docker ps
curl http://localhost:3000
```

## 优势

### GitHub Actions方案优势
1. **稳定的网络连接**: 绕过本地网络限制
2. **云基础设施**: 利用GitHub的构建环境
3. **自动化流程**: 代码推送自动触发构建
4. **多架构支持**: 原生支持ARM64和AMD64
5. **构建缓存**: 加速后续构建过程

### 技术特性
1. **Docker Buildx**: 使用最新的多架构构建技术
2. **缓存优化**: GitHub Actions缓存加速构建
3. **安全认证**: 使用GitHub Secrets保护敏感信息
4. **版本管理**: 支持分支和标签的镜像版本管理

## 故障排除

### 常见问题
1. **构建失败**: 检查GitHub Secrets配置
2. **推送失败**: 验证TCR凭据有效性
3. **架构问题**: 确认目标平台设置正确

### 日志查看
- GitHub Actions日志: 仓库 → Actions → 具体工作流运行
- Docker运行日志: `docker logs zhihutongxing`

## 后续维护

### 更新镜像
1. 修改代码并推送到main分支
2. GitHub Actions自动构建新镜像
3. 在服务器上拉取最新镜像并重新部署

### 监控和维护
- 定期检查GitHub Actions构建状态
- 监控TCR存储使用情况
- 更新JWT Token（如需要）
