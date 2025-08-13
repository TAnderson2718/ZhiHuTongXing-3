# Sentry 错误监控与调试自动化指南

本文档介绍如何使用集成的 Sentry 错误监控系统和调试自动化流程。

## 🚀 快速开始

### 1. 环境配置

在 `.env.local` 文件中添加以下配置：

```bash
# Sentry 配置
SENTRY_DSN="your-sentry-dsn-here"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn-here"
SENTRY_ORG="thomas-7b"
SENTRY_PROJECT="zhihutongxing"
SENTRY_AUTH_TOKEN="your-sentry-auth-token-here"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 2. 获取 Sentry DSN

1. 登录 [Sentry.io](https://sentry.io)
2. 进入项目 `thomas-7b/zhihutongxing`
3. 在 Settings > Client Keys (DSN) 中获取 DSN
4. 将 DSN 添加到环境变量中

### 3. 验证配置

```bash
# 检查健康状态
npm run health:check

# 测试 Sentry 连接
npm run sentry:test

# 运行部署前检查
npm run pre-deploy
```

## 📊 监控功能

### 错误监控

- **自动错误捕获**: 所有未处理的错误会自动发送到 Sentry
- **错误边界**: React 组件错误会被错误边界捕获并上报
- **API 错误**: 服务端 API 错误会自动记录
- **性能监控**: 页面加载时间和 API 响应时间监控

### 用户体验监控

- **Session Replay**: 记录用户操作回放（生产环境采样率 10%）
- **面包屑**: 记录用户操作路径
- **用户上下文**: 记录用户信息和设备信息

## 🔧 调试工具

### 健康检查端点

```bash
# 基础健康检查
GET /api/health

# 深度健康检查
POST /api/health
```

返回系统状态、内存使用、运行时间等信息。

### Sentry 测试端点

仅在开发环境可用：

```bash
# 测试错误捕获
GET /api/sentry-test?type=error

# 测试警告消息
GET /api/sentry-test?type=warning

# 测试性能监控
GET /api/sentry-test?type=performance

# 测试用户上下文
GET /api/sentry-test?type=user
```

### 调试自动化脚本

```bash
# 运行健康检查
npm run debug:health

# 测试 Sentry 连接
npm run debug:sentry

# 检查系统资源
npm run debug:resources

# 分析错误日志
npm run debug:analyze

# 清理旧日志
npm run debug:cleanup

# 启动持续监控
npm run debug:monitor
```

## 📈 生产环境配置

### 1. 环境变量设置

生产环境必须设置的环境变量：

```bash
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-auth-token"
NEXT_PUBLIC_APP_VERSION="1.0.0"
SENTRY_ENVIRONMENT="production"
```

### 2. 采样率配置

生产环境建议的采样率：

- **错误采样**: 100%（所有错误都记录）
- **性能采样**: 10%（避免过多数据）
- **Session Replay**: 10%（错误时 100%，正常时 10%）

### 3. 发布跟踪

每次部署时自动创建 Sentry 发布：

```bash
# 构建时自动上传 source maps
npm run build

# 手动创建发布
npx sentry-cli releases new $VERSION
npx sentry-cli releases files $VERSION upload-sourcemaps .next/static
npx sentry-cli releases finalize $VERSION
```

## 🚨 告警配置

### 推荐的告警规则

1. **错误率告警**: 错误率超过 5% 时告警
2. **性能告警**: 页面加载时间超过 3 秒时告警
3. **可用性告警**: 健康检查失败时告警
4. **内存告警**: 内存使用率超过 80% 时告警

### 告警通道

- **邮件通知**: 发送到开发团队邮箱
- **Slack 集成**: 发送到 #alerts 频道
- **PagerDuty**: 严重错误时呼叫值班人员

## 🔍 错误分析

### 错误分类

1. **JavaScript 错误**: 前端代码错误
2. **API 错误**: 后端接口错误
3. **数据库错误**: 数据库连接或查询错误
4. **第三方服务错误**: 外部 API 调用错误

### 调试流程

1. **错误发现**: Sentry 告警或用户反馈
2. **错误分析**: 查看错误详情、堆栈跟踪、用户上下文
3. **问题重现**: 使用 Session Replay 重现问题
4. **修复验证**: 部署修复后验证错误是否解决

## 📝 最佳实践

### 错误处理

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // 可能出错的代码
  await riskyOperation()
} catch (error) {
  // 添加上下文信息
  Sentry.withScope((scope) => {
    scope.setTag('operation', 'riskyOperation')
    scope.setLevel('error')
    scope.setContext('additional', { userId, timestamp })
    Sentry.captureException(error)
  })
  
  throw error // 重新抛出错误
}
```

### 性能监控

```typescript
import * as Sentry from '@sentry/nextjs'

const transaction = Sentry.startTransaction({
  name: 'API Call',
  op: 'http.client'
})

try {
  const result = await apiCall()
  transaction.setStatus('ok')
  return result
} catch (error) {
  transaction.setStatus('internal_error')
  throw error
} finally {
  transaction.finish()
}
```

### 用户上下文

```typescript
import * as Sentry from '@sentry/nextjs'

// 设置用户信息
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username
})

// 添加标签
Sentry.setTag('userType', user.type)
Sentry.setTag('subscription', user.subscription)
```

## 🛠️ 故障排除

### 常见问题

1. **Sentry 未接收到错误**
   - 检查 DSN 配置是否正确
   - 确认网络连接正常
   - 查看浏览器控制台是否有 Sentry 相关错误

2. **Source Maps 未上传**
   - 检查 SENTRY_AUTH_TOKEN 是否设置
   - 确认构建过程中没有错误
   - 验证 .sentryclirc 配置

3. **性能数据缺失**
   - 检查 tracesSampleRate 配置
   - 确认性能监控已启用
   - 验证事务是否正确创建和完成

### 调试命令

```bash
# 检查 Sentry CLI 配置
npx sentry-cli info

# 验证 DSN 连接
npx sentry-cli send-event -m "Test message"

# 列出项目发布
npx sentry-cli releases list

# 查看最新错误
npx sentry-cli issues list
```

## 📞 支持

如有问题，请联系：

- **技术支持**: tech-support@example.com
- **紧急联系**: +86-xxx-xxxx-xxxx
- **文档更新**: 请提交 PR 到项目仓库
