# 生产环境部署检查清单

## 🚀 部署前必须完成的任务

### 1. ✅ Sentry 错误监控已集成
- [x] 安装 @sentry/nextjs 依赖
- [x] 配置 instrumentation.ts 和 instrumentation-client.ts
- [x] 创建健康检查端点 `/api/health`
- [x] 创建 Sentry 测试端点 `/api/sentry-test`
- [x] 集成错误边界组件
- [x] 配置中间件增强监控

### 2. 🔧 环境变量配置

**必需的环境变量：**
```bash
# Sentry 配置
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-auth-token"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# 数据库
DATABASE_URL="postgresql://user:password@host:port/database"

# 认证
SESSION_SECRET="your-strong-session-secret-32-chars-min"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# 云存储（可选）
CLOUD_STORAGE_PROVIDER="aliyun" # 或 "tencent" 或 "local"
ALIYUN_OSS_ACCESS_KEY_ID="your-access-key"
ALIYUN_OSS_ACCESS_KEY_SECRET="your-secret"
ALIYUN_OSS_BUCKET="your-bucket"
ALIYUN_OSS_REGION="your-region"
```

### 3. 🔍 部署前检查命令

```bash
# 运行完整的部署前检查
npm run pre-deploy

# 单独检查各项
npm run debug:health      # 健康检查
npm run debug:sentry      # Sentry 连接测试
npm run debug:resources   # 系统资源检查
npm run type-check        # TypeScript 类型检查
npm run lint              # 代码质量检查
```

### 4. 🏗️ 构建和部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start

# 或使用 Docker
docker build -t zhihu-tongxing .
docker run -p 3000:3000 zhihu-tongxing
```

## 📊 生产环境监控

### Sentry 配置验证

1. **错误监控测试**
   ```bash
   # 测试错误捕获
   curl "http://localhost:3000/api/sentry-test?type=error"
   
   # 测试性能监控
   curl "http://localhost:3000/api/sentry-test?type=performance"
   ```

2. **健康检查**
   ```bash
   # 基础健康检查
   curl "http://localhost:3000/api/health"
   
   # 深度健康检查
   curl -X POST "http://localhost:3000/api/health"
   ```

### 持续监控

```bash
# 启动持续监控（开发环境）
npm run debug:monitor
```

## 🚨 告警配置

### Sentry 告警规则建议

1. **错误率告警**: 错误率 > 5%
2. **性能告警**: 页面加载时间 > 3秒
3. **可用性告警**: 健康检查失败
4. **内存告警**: 内存使用率 > 80%

### 通知渠道

- 邮件通知: 发送到开发团队
- Slack 集成: #alerts 频道
- 短信通知: 严重错误时

## 🔒 安全检查

- [x] 环境变量不包含敏感信息
- [x] SESSION_SECRET 长度 ≥ 32 字符
- [x] 数据库连接使用 SSL
- [x] 中间件配置安全头
- [x] API 路由有适当的认证保护

## 📈 性能优化

- [x] Next.js 内置优化已启用
- [x] 图片优化配置
- [x] 静态资源缓存
- [ ] CDN 配置（推荐）
- [ ] 数据库连接池（推荐）
- [ ] Redis 缓存（推荐）

## 🔄 部署流程

### 自动化部署（推荐）

1. **代码提交** → GitHub
2. **CI/CD 触发** → GitHub Actions
3. **自动测试** → 类型检查、代码质量
4. **构建镜像** → Docker 多架构构建
5. **安全扫描** → Trivy 漏洞扫描
6. **部署到生产** → 腾讯云 TCR

### 手动部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
npm ci

# 3. 运行检查
npm run pre-deploy

# 4. 构建项目
npm run build

# 5. 启动服务
pm2 start npm --name "zhihu-tongxing" -- start
```

## 🆘 故障排除

### 常见问题

1. **Sentry 未接收错误**
   - 检查 DSN 配置
   - 验证网络连接
   - 查看浏览器控制台

2. **健康检查失败**
   - 检查数据库连接
   - 验证环境变量
   - 查看应用日志

3. **构建失败**
   - 运行 `npm run type-check`
   - 修复 TypeScript 错误
   - 检查依赖版本

### 紧急联系

- **技术支持**: tech-support@example.com
- **紧急热线**: +86-xxx-xxxx-xxxx
- **Sentry 项目**: https://sentry.io/organizations/thomas-7b/projects/zhihutongxing/

## 📝 部署后验证

```bash
# 验证应用启动
curl -f http://localhost:3000/api/health || exit 1

# 验证 Sentry 集成
curl -f "http://localhost:3000/api/sentry-test?type=info" || exit 1

# 验证主页加载
curl -f http://localhost:3000 || exit 1
```

---

**最后更新**: 2024-12-08
**版本**: 1.0.0
**状态**: ✅ 已完成 Sentry 集成和调试自动化
