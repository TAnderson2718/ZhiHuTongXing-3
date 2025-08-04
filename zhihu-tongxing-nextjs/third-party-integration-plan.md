# 第三方服务集成计划

## 1. 智谱清言集成

### 当前状态
- 已实现模拟聊天界面 (`/src/app/support/consultation/page.tsx`)
- 具备基础的聊天UI和交互逻辑

### 集成方案
```typescript
// 集成智谱清言API
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

// 在consultation页面中替换模拟响应
const sendMessage = async (message: string) => {
  const response = await fetch('/api/zhipu-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  return response.json()
}
```

### 实施步骤
1. 申请智谱清言API密钥
2. 创建 `/src/app/api/zhipu-chat/route.ts` API路由
3. 修改consultation页面集成真实API
4. 添加错误处理和重试机制

## 2. 微信公众号集成

### 当前状态
- 已添加微信联系方式展示
- 显示公众号名称"育见未来_ing"

### 集成方案
```typescript
// 微信公众号文章嵌入
const WeChatArticleEmbed = ({ articleUrl }: { articleUrl: string }) => {
  return (
    <iframe 
      src={articleUrl}
      width="100%" 
      height="600"
      frameBorder="0"
      scrolling="auto"
    />
  )
}
```

### 实施步骤
1. 获取微信公众号授权
2. 在知识科普馆中嵌入公众号文章
3. 添加公众号二维码展示
4. 实现文章同步功能

## 3. 其他优化建议

### 视频嵌入优化
- 支持腾讯视频、Bilibili等平台链接
- 优化视频播放体验
- 添加视频进度记录

### 数据统计完善
- 用户行为分析
- 评估结果统计
- 学习进度跟踪

## 预期效果

完成集成后将实现：
- 真实的AI咨询服务体验
- 丰富的微信公众号内容
- 更完善的用户服务体系
