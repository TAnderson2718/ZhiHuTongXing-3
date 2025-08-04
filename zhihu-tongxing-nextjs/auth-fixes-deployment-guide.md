# 智护童行认证修复部署指南

## 概述
本指南包含了解决生产环境管理员登录问题的关键修复。这些修复已经在生产服务器 `http://43.143.97.170` 上测试并验证成功。

## 问题描述
- **问题**: 管理员在生产环境中无法登录，Cookie的Secure标志在HTTP环境下阻止了Cookie传输
- **症状**: 登录API返回200 OK，但`/api/auth/me`返回401，导致自动重定向到登录页面
- **根本原因**: `secure: process.env.NODE_ENV === 'production'`在生产环境中设置为true，但服务器使用HTTP协议

## 关键修复文件

### 1. `/src/lib/auth.ts`
**修复内容**:
- 导出缺失的常量: `SESSION_DURATION` 和 `SESSION_COOKIE_NAME`
- 修改 `setSessionCookie()` 函数，设置 `secure: false` 用于HTTP环境

**关键修改**:
```typescript
// 导出常量
export const SESSION_COOKIE_NAME = 'session'
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// 修改Cookie设置
export function setSessionCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // 在HTTP环境下设置为false
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}
```

### 2. `/src/app/api/auth/login/route.ts`
**修复内容**:
- 使用 `NextResponse.cookies.set()` 替代 `cookies()` 函数
- 强制设置 `secure: false` 用于HTTP环境

**关键修改**:
```typescript
// 在Route Handler中手动设置Cookie
const cookieOptions = {
  httpOnly: true,
  secure: false, // 强制设置为false用于HTTP
  sameSite: 'lax' as const,
  maxAge: SESSION_DURATION / 1000,
  path: '/',
}

console.log('Setting cookie with options:', cookieOptions)
response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions)
```

## 部署说明

### Docker镜像状态
- **TCR镜像**: `zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest`
- **状态**: 已推送到腾讯云TCR，但不包含最新的认证修复（由于网络连接问题无法重新构建）
- **建议**: 在容器部署后，手动应用认证修复文件

### 应用修复的步骤
1. **拉取镜像**:
   ```bash
   docker pull zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest
   ```

2. **运行容器**:
   ```bash
   docker run -d -p 3000:3000 --name zhihutongxing zhihutongxing-tcr.tencentcloudcr.com/project-zhihutongxing/app-zhihutongxing:latest
   ```

3. **应用认证修复**:
   ```bash
   # 复制修复文件到容器
   docker cp src/lib/auth.ts zhihutongxing:/app/src/lib/auth.ts
   docker cp src/app/api/auth/login/route.ts zhihutongxing:/app/src/app/api/auth/login/route.ts
   
   # 重启容器以应用修复
   docker restart zhihutongxing
   ```

## 验证修复
1. **测试登录API**:
   ```bash
   curl -v -X POST http://your-server/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@zhihutongxing.com","password":"Admin@2025!Secure#"}' \
     2>&1 | grep -E "(HTTP/|set-cookie)"
   ```

2. **验证Cookie设置**:
   - 检查响应中的`set-cookie`头
   - 确认Cookie没有`Secure`标志
   - 验证Cookie可以在HTTP环境下传输

3. **测试完整登录流程**:
   - 访问 `/admin` 页面
   - 使用凭据 `admin/Admin@2025!Secure#` 登录
   - 验证成功跳转到 `/admin/dashboard`
   - 测试管理功能访问

## 生产环境验证
✅ **已在生产环境验证**: `http://43.143.97.170`
- 管理员登录正常工作
- 所有管理功能可访问
- Cookie正确设置且无Secure标志

## 注意事项
- 这些修复专门针对HTTP环境
- 如果将来启用HTTPS，需要将`secure`标志改回`true`
- 建议在HTTPS环境中使用适当的安全设置
