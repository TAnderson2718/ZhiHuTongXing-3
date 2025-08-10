# 知乎同行 - 多架构Docker部署指南

## 📋 项目概述

知乎同行是一个基于Next.js的现代化Web应用，支持多架构Docker部署，兼容AMD64和ARM64处理器架构。

## 🏗️ 技术架构

- **前端框架**: Next.js 14 + React 18 + TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: SQLite (生产环境)
- **容器化**: Docker多架构支持 (AMD64/ARM64)
- **镜像仓库**: 腾讯云容器镜像服务 (TCR)
- **CI/CD**: GitHub Actions

## 🚀 多架构Docker部署

### 支持的架构
- ✅ **AMD64** (x86_64) - Intel/AMD处理器
- ✅ **ARM64** (aarch64) - Apple Silicon, ARM服务器

### 镜像信息
- **镜像地址**: `zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest`
- **自动构建**: 推送到main分支时自动触发多架构构建
- **架构支持**: Docker会根据运行环境自动选择匹配的架构

## 📦 快速部署

### 方法一：使用部署脚本 (推荐)

```bash
# 1. 设置TCR登录凭据
export TCR_USERNAME=your_username
export TCR_PASSWORD=your_password

# 2. 运行部署脚本
./deploy-multiarch.sh
```

### 方法二：使用Docker Compose

```bash
# 1. 登录TCR
echo $TCR_PASSWORD | docker login zhihutongxing-tcr.tencentcloudcr.com --username $TCR_USERNAME --password-stdin

# 2. 启动服务
docker-compose -f docker-compose.multiarch.yml up -d

# 3. 查看日志
docker-compose -f docker-compose.multiarch.yml logs -f
```

### 方法三：直接使用Docker命令

```bash
# 1. 登录TCR
docker login zhihutongxing-tcr.tencentcloudcr.com

# 2. 拉取镜像
docker pull zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest

# 3. 运行容器
docker run -d \
  --name zhihutongxing-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest
```

## 🔧 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn
- Docker (可选)

### 开发步骤

```bash
# 1. 克隆项目
git clone https://github.com/TAnderson2718/ZhiHuTongXing-3.git
cd ZhiHuTongXing-3/zhihu-tongxing-nextjs

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# http://localhost:3000
```

## 🏭 生产环境部署

### 系统要求
- Docker 20.10+
- 2GB+ RAM
- 10GB+ 磁盘空间

### 部署验证

部署完成后，可以通过以下方式验证：

```bash
# 检查容器状态
docker ps

# 检查应用响应
curl http://localhost:3000

# 查看容器日志
docker logs zhihutongxing-app

# 验证镜像架构
docker inspect zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest | grep Architecture
```

## 🔄 CI/CD流水线

### GitHub Actions工作流

项目配置了自动化CI/CD流水线：

- **触发条件**: 推送到main分支或创建Pull Request
- **构建过程**: 
  1. 代码检出
  2. 设置Docker Buildx多架构构建环境
  3. 登录腾讯云TCR
  4. 构建AMD64和ARM64镜像
  5. 推送到镜像仓库

### 工作流文件
- 位置: `.github/workflows/docker-multiarch.yml`
- 状态: [![Build Multi-Architecture Docker Image](https://github.com/TAnderson2718/ZhiHuTongXing-3/workflows/Build%20Multi-Architecture%20Docker%20Image/badge.svg)](https://github.com/TAnderson2718/ZhiHuTongXing-3/actions)

## 📁 项目结构

```
ZhiHuTongXing-3/
├── .github/workflows/          # GitHub Actions工作流
│   └── docker-multiarch.yml    # 多架构Docker构建
├── zhihu-tongxing-nextjs/      # Next.js应用源码
│   ├── src/                    # 源代码目录
│   ├── public/                 # 静态资源
│   ├── Dockerfile              # Docker构建文件
│   └── package.json            # 项目依赖
├── deploy-multiarch.sh         # 多架构部署脚本
├── docker-compose.multiarch.yml # Docker Compose配置
└── README.md                   # 项目文档
```

## 🛠️ 故障排除

### 常见问题

1. **镜像拉取失败**
   ```bash
   # 检查TCR登录状态
   docker login zhihutongxing-tcr.tencentcloudcr.com
   ```

2. **容器启动失败**
   ```bash
   # 查看详细日志
   docker logs zhihutongxing-app
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   # 或修改端口映射
   docker run -p 8080:3000 ...
   ```

### 架构兼容性

- **Apple Silicon Mac**: 自动使用ARM64镜像
- **Intel Mac**: 自动使用AMD64镜像
- **Linux服务器**: 根据CPU架构自动选择

## 📞 支持与反馈

如遇到问题，请：
1. 查看[Issues](https://github.com/TAnderson2718/ZhiHuTongXing-3/issues)
2. 创建新的Issue描述问题
3. 提供详细的错误日志和环境信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
