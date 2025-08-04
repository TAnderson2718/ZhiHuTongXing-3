# 使用官方Node.js 18 Alpine镜像（支持多架构）
FROM node:18-alpine

# 安装必要的依赖
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 复制应用文件
COPY package*.json ./
COPY . .

# 安装依赖
RUN npm ci

# 创建数据目录
RUN mkdir -p data

# 构建应用
RUN npm run build

# 创建非 root 用户（Alpine兼容）
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
