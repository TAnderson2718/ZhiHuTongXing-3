# GitHub Secrets 设置指南

## 🎯 **当前状态**
✅ **代码已成功推送到GitHub**: https://github.com/TAnderson2718/ZhiHuTongXing-3
✅ **GitHub Actions工作流已创建**: `.github/workflows/docker-multiarch.yml`
❌ **需要设置GitHub Secrets**: 用于TCR认证

## 📋 **必需的GitHub Secrets**

请在GitHub仓库中手动设置以下Secrets：

### 1. 进入GitHub仓库设置
1. 访问: https://github.com/TAnderson2718/ZhiHuTongXing-3
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**

### 2. 添加Repository Secrets
点击 **New repository secret** 并添加以下两个Secrets：

#### Secret 1: TCR_USERNAME
- **Name**: `TCR_USERNAME`
- **Value**: `100019031671`

#### Secret 2: TCR_PASSWORD
- **Name**: `TCR_PASSWORD`
- **Value**: `eyJhbGciOiJSUzI1NiIsImtpZCI6IkUyVE46SVNIQjpYSkZQOjVaNEE6UDRUSjpFSU9DOkZTSkQ6UjQ2RTpCWUw1OktBNDU6WkZPSzpCVjJNIn0.eyJvd25lclVpbiI6IjEwMDAxOTAzMTY3MSIsIm9wZXJhdG9yVWluIjoiMTAwMDE5MDMxNjcxIiwidG9rZW5JZCI6ImQyOGN0cDcxbjNiNTQ1NThrazkwIiwiZXhwIjoyMDY5NjgwNjEyLCJuYmYiOjE3NTQzMjA2MTIsImlhdCI6MTc1NDMyMDYxMn0.A7POD7RyXeVghPzRG8wzrbQ0P_dr2s67TtKH61JDhFeclbcbMpoYQu0R-FVQxt_PubrZd2v8rFAyEMA4Aq-YUaMCW8gZ3GbWjiy2qD3Uq6rP-5L3vwdZRb3sMokaBgIzaDQRIZTswH9Id_PMclqou8iAJvGh1p0-E7djdOoJnI33tExocNh4sijj6WI3voS3AA6YnFIR5ZNHcCovb0KggRrh8AzVuA8EPXYnxfJipDMKue13OIiw-du6Q0DxgSVqAJeXuxIT4R42FYUR6xnXwNU-JEVE4yKHHSw2UN_8qjfkmcbknnTbUGdUWmrz3jSb_jDvIfVqsIx-sMSwLwv_xw`

## 🚀 **触发多架构构建**

设置完Secrets后，有三种方式触发构建：

### 方式1: 手动触发（推荐）
1. 进入GitHub仓库 → **Actions** 标签
2. 选择 **"Build Multi-Architecture Docker Image"** 工作流
3. 点击 **"Run workflow"** → **"Run workflow"**

### 方式2: 推送新代码（自动触发）
```bash
# 在本地项目目录中
echo "# 触发构建" >> README.md
git add README.md
git commit -m "Trigger multi-architecture build"
git push origin main
```

### 方式3: 创建Pull Request（自动触发）
创建任何Pull Request都会自动触发构建

## 📊 **监控构建过程**

### 查看构建状态
1. 进入GitHub仓库 → **Actions** 标签
2. 查看最新的工作流运行状态
3. 点击具体的运行实例查看详细日志

### 预期构建时间
- **总时间**: 10-15分钟
- **阶段1**: 设置环境 (2-3分钟)
- **阶段2**: 构建ARM64镜像 (4-6分钟)
- **阶段3**: 构建AMD64镜像 (4-6分钟)
- **阶段4**: 推送到TCR (1-2分钟)

## ✅ **构建成功后的验证**

构建完成后，返回服务器验证：

```bash
# SSH连接到服务器
ssh server-zhihutongxing

# 拉取多架构镜像
docker pull zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 验证镜像架构
docker inspect zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 运行容器测试
docker run -d -p 3000:3000 --name zhihutongxing \
  zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 验证应用运行
curl http://localhost:3000
```

## 🎯 **预期结果**

构建成功后，您将获得：
- ✅ 支持ARM64和AMD64的多架构Docker镜像
- ✅ 包含所有认证修复的最新版本
- ✅ 可在任何架构的服务器上运行
- ✅ 自动推送到腾讯云TCR

## 📞 **下一步**

1. **立即行动**: 设置GitHub Secrets（5分钟）
2. **触发构建**: 手动运行工作流（15分钟）
3. **验证部署**: 在服务器上测试拉取和运行（5分钟）

**总预计时间**: 25分钟完成整个多架构部署流程
