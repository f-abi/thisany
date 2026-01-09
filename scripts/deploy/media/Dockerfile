FROM node:23-alpine AS base

# --- 构建 ---
FROM base AS build

# 设置工作目录
WORKDIR /app

# 复制整个项目
COPY . .

# 安装 pnpm
RUN npm install -g pnpm@latest

# 安装所有工作区的依赖
RUN pnpm install

# 构建应用
RUN pnpm turbo build --filter=media...

# --- 运行时 ---
FROM base AS runner

# 设置工作目录
WORKDIR /app

# 分配用户组
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 复制构建输出
COPY --from=build --chown=nextjs:nodejs /app/apps/media/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/media/.next/static ./apps/media/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/media/public ./apps/media/public

# 确保缓存目录存在并设置挂载点，用于持久化 Next.js 缓存（如图片）
RUN mkdir -p apps/media/.next/cache
VOLUME ["/app/apps/media/.next/cache"]

# --- 启动 ---
CMD ["node", "apps/media/server.js"]

EXPOSE 3000
