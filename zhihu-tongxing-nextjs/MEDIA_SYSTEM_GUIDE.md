# 智护童行媒体支持系统部署指南

## 概述

本指南详细介绍了智护童行平台媒体支持系统的部署、配置和测试方法。该系统提供了完整的文件上传、云存储集成、视频平台嵌入和富文本编辑功能。

## 系统架构

### 核心组件

1. **文件上传API** (`/api/upload`)
   - 支持图片、视频、文档上传
   - 集成安全检查和文件验证
   - 支持批量上传和进度显示

2. **增强富文本编辑器** (`EnhancedRichTextEditor`)
   - 支持拖拽上传和URL链接插入
   - 集成视频平台链接自动识别
   - 提供预览模式和自动保存功能

3. **视频平台集成** (`video-platforms.ts`)
   - 支持 Bilibili、腾讯视频、爱奇艺、优酷、YouTube
   - 自动生成 iframe 嵌入代码
   - 支持视频缩略图获取

4. **云存储支持** (`cloud-storage.ts`)
   - 统一的存储接口抽象
   - 支持阿里云 OSS 和腾讯云 COS
   - 本地存储备选方案

## 安装和配置

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd zhihu-tongxing-nextjs

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env.local
```

### 2. 环境变量配置

编辑 `.env.local` 文件，配置以下关键变量：

#### 基础配置
```env
# 文件上传配置
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"

# 本地存储配置
LOCAL_UPLOAD_DIR="./public/uploads"
LOCAL_UPLOAD_URL="/uploads"
CLOUD_STORAGE_PROVIDER="local"
```

#### 云存储配置（可选）

**阿里云 OSS:**
```env
CLOUD_STORAGE_PROVIDER="aliyun"
ALIYUN_OSS_REGION="oss-cn-beijing"
ALIYUN_OSS_ACCESS_KEY_ID="your-access-key-id"
ALIYUN_OSS_ACCESS_KEY_SECRET="your-access-key-secret"
ALIYUN_OSS_BUCKET="your-bucket-name"
ALIYUN_OSS_CDN_DOMAIN="https://your-cdn-domain.com"
```

**腾讯云 COS:**
```env
CLOUD_STORAGE_PROVIDER="tencent"
TENCENT_COS_REGION="ap-beijing"
TENCENT_COS_SECRET_ID="your-secret-id"
TENCENT_COS_SECRET_KEY="your-secret-key"
TENCENT_COS_BUCKET="your-bucket-name"
TENCENT_COS_CDN_DOMAIN="https://your-cdn-domain.com"
```

### 3. 创建上传目录

```bash
# 创建本地上传目录
mkdir -p public/uploads
mkdir -p public/uploads/images
mkdir -p public/uploads/videos
mkdir -p public/uploads/documents

# 设置权限（Linux/macOS）
chmod 755 public/uploads
```

### 4. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 功能测试

### 1. 文件上传测试

#### 测试步骤：
1. 访问 `/admin/articles/new` 或 `/admin/articles/edit/[id]`
2. 使用管理员账号登录 (admin / Admin@2025!Secure#)
3. 在富文本编辑器中测试以下功能：

#### 图片上传测试：
- 拖拽图片文件到编辑器
- 点击工具栏的图片上传按钮
- 支持格式：JPG, PNG, GIF, WebP
- 验证文件大小限制（默认10MB）

#### 视频上传测试：
- 上传视频文件（MP4, WebM, OGG）
- 验证视频预览功能
- 测试视频播放控件

### 2. 视频平台嵌入测试

#### 支持的平台和测试链接：

**Bilibili:**
```
https://www.bilibili.com/video/BV1xx411c7mu
https://b23.tv/BV1xx411c7mu
```

**腾讯视频:**
```
https://v.qq.com/x/cover/mzc00200mp8vo9b.html
```

**爱奇艺:**
```
https://www.iqiyi.com/v_19rr7aqk5o.html
```

**优酷:**
```
https://v.youku.com/v_show/id_XMzg2ODQzODI4MA==.html
```

**YouTube:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

#### 测试步骤：
1. 在富文本编辑器中点击视频嵌入按钮
2. 粘贴上述任一测试链接
3. 验证自动识别和嵌入功能
4. 检查生成的 iframe 代码

### 3. 富文本编辑器功能测试

#### 基础功能：
- 文本格式化（粗体、斜体、下划线）
- 列表创建（有序、无序）
- 链接插入和编辑
- 图片和视频插入

#### 高级功能：
- 自动保存（30秒间隔）
- 撤销/重做操作
- 预览模式切换
- 响应式设计测试

### 4. API 端点测试

#### 文件上传 API：
```bash
# 测试单文件上传
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@test-image.jpg" \
  -F "type=image" \
  --cookie "session=your-session-cookie"

# 测试批量上传
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@test1.jpg" \
  -F "files=@test2.png" \
  -F "type=image" \
  --cookie "session=your-session-cookie"
```

#### 文件列表 API：
```bash
curl -X GET "http://localhost:3000/api/upload?type=image&limit=10" \
  --cookie "session=your-session-cookie"
```

#### 文件删除 API：
```bash
curl -X DELETE "http://localhost:3000/api/upload?filename=test-image.jpg" \
  --cookie "session=your-session-cookie"
```

## 故障排除

### 常见问题

#### 1. 文件上传失败
- 检查文件大小是否超过限制
- 验证文件类型是否在允许列表中
- 确认上传目录权限设置正确
- 检查磁盘空间是否充足

#### 2. 云存储连接失败
- 验证 API 密钥配置正确
- 检查网络连接和防火墙设置
- 确认存储桶权限配置
- 查看应用日志获取详细错误信息

#### 3. 视频嵌入不显示
- 检查视频平台链接格式
- 验证 iframe 安全策略
- 确认网络可以访问视频平台
- 检查浏览器控制台错误信息

#### 4. 富文本编辑器异常
- 清除浏览器缓存和 Cookie
- 检查 JavaScript 控制台错误
- 验证组件依赖是否正确加载
- 确认用户权限设置

### 日志查看

```bash
# 查看应用日志
tail -f logs/app.log

# 查看 Next.js 开发日志
npm run dev

# 查看生产环境日志
pm2 logs zhihu-tongxing
```

## 性能优化

### 1. 图片优化
- 启用 Next.js 图片优化
- 配置适当的图片质量设置
- 使用 CDN 加速图片加载

### 2. 视频优化
- 限制视频文件大小和时长
- 考虑视频转码服务
- 使用视频 CDN 分发

### 3. 缓存策略
- 配置 Redis 缓存
- 设置适当的浏览器缓存头
- 使用 CDN 缓存静态资源

## 安全考虑

### 1. 文件安全
- 严格验证文件类型和大小
- 扫描上传文件的恶意内容
- 限制文件访问权限

### 2. 用户权限
- 确保只有管理员可以上传文件
- 实施适当的身份验证
- 记录所有文件操作日志

### 3. 数据保护
- 定期备份上传的文件
- 加密敏感配置信息
- 监控异常访问行为

## 部署到生产环境

### 1. 环境配置
```bash
# 设置生产环境变量
export NODE_ENV=production
export DEBUG_MODE=false

# 构建应用
npm run build
```

### 2. 服务器配置
- 配置反向代理（Nginx/Apache）
- 设置 SSL 证书
- 配置防火墙规则
- 设置监控和日志

### 3. 持续部署
- 设置 CI/CD 流水线
- 配置自动化测试
- 实施滚动更新策略

## 支持和维护

如有问题或需要技术支持，请：

1. 查看本指南的故障排除部分
2. 检查应用日志文件
3. 联系技术支持团队
4. 提交 GitHub Issue（如适用）

---

**版本:** 1.0.0  
**更新日期:** 2025-01-03  
**维护团队:** 智护童行开发团队
