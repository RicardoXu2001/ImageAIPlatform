# AI 生图平台

这是一个面向 SaaS 场景设计的 AI 生图平台 monorepo 项目。当前项目已经包含用户端、管理端、后端 API、异步 Worker、Prisma 数据库层和共享类型层，适合作为企业级 AI 图片生成产品的基础架构。

## 技术栈

- 前端：Next.js 15、App Router、React、TypeScript、TailwindCSS、shadcn/ui 风格组件
- 管理端：Next.js 15、App Router、响应式后台布局
- 后端：Node.js、Express、TypeScript
- 数据库：PostgreSQL、Prisma
- 队列：Redis、BullMQ
- AI：OpenAI Images API
- 存储：本地存储 / AWS S3
- 支付：Stripe
- 架构：pnpm workspace monorepo

## 项目结构

```text
ai-image-platform/
  apps/
    frontend/       用户端 Web 应用
    admin/          管理端 Dashboard
    backend/        后端 API 服务
    worker/         AI 生图异步任务 Worker

  packages/
    database/       Prisma schema、Prisma Client、数据库模型
    shared/         共享类型、Zod Schema、DTO、队列常量

  .env.example      环境变量示例
  package.json      根项目脚本
  pnpm-workspace.yaml
  tsconfig.base.json
```

## 各模块说明

### `apps/frontend`

用户端应用，运行在 `http://localhost:3000`。

主要功能：

- 首页
- Prompt 输入
- AI 图片生成
- 图片预览
- 图片历史记录页面
- Pricing / Credits 入口
- 深色主题
- Apple 风格响应式 UI

该应用只通过后端 API 访问数据，不直接访问数据库。

### `apps/admin`

管理端应用，运行在 `http://localhost:3001`。

主要功能：

- Admin Dashboard
- 用户管理
- AI 任务队列查看
- 图片资产管理
- Billing / Stripe 管理入口
- 系统设置入口

管理端同样只访问后端 API，不直接访问 Prisma。

### `apps/backend`

后端 API 服务，运行在 `http://localhost:4000`。

主要职责：

- 用户登录
- 创建 AI 生图任务
- 返回 `taskId`
- 提供 polling 查询接口
- Credits 预扣与发放
- Stripe Checkout
- Admin API
- 将任务投递到 BullMQ 队列

核心接口：

```text
POST /api/auth/login
POST /api/generations
GET  /api/generations/:taskId
GET  /api/credits/:userId
POST /api/credits/grant
POST /api/billing/checkout
GET  /api/admin/metrics
GET  /api/admin/users
GET  /api/admin/tasks
```

### `apps/worker`

异步任务服务，不提供页面。

主要职责：

- 消费 Redis / BullMQ 队列
- 调用 OpenAI Images API
- 将生成图片保存到本地或 AWS S3
- 写入 `ImageAsset`
- 更新 `GenerationTask` 状态
- 失败时自动退还 Credits

### `packages/database`

数据库层。

包含：

- Prisma schema
- Prisma Client
- 用户表
- 生图任务表
- 图片资产表
- 支付表
- 订阅表
- Prompt 历史表
- Credits 流水表
- Admin 审计日志表

### `packages/shared`

共享代码层。

包含：

- API 请求 Schema
- DTO 类型
- 队列名称
- Job Payload 类型
- Auth / Billing / Credits / Generation 共享定义

这样可以避免 frontend、admin、backend、worker 重复定义同一套类型。

## 启动前准备

你需要先安装：

- Node.js 20 或更高版本
- pnpm，推荐
- PostgreSQL
- Redis
- OpenAI API Key

可选：

- AWS S3
- Stripe

## 安装 pnpm

推荐使用 pnpm，因为项目使用了 workspace 和 `--filter` 脚本。

```bash
npm install -g pnpm
```

检查安装：

```bash
pnpm --version
```

如果你使用 Corepack，也可以：

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

## 安装依赖

在项目根目录执行：

```bash
pnpm install
```

项目根目录是：

```text
C:\Users\xudic\Documents\Meeting-Image
```

## 配置环境变量

复制 `.env.example` 为 `.env`。

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

macOS / Linux：

```bash
cp .env.example .env
```

然后编辑 `.env`。

最低必须配置：

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_image_platform?schema=public"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
OPENAI_API_KEY="sk-your-key"
```

## 环境变量说明

### 数据库

```text
DATABASE_URL
```

PostgreSQL 连接地址。

示例：

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_image_platform?schema=public"
```

### Redis

```text
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD=""
```

BullMQ 使用 Redis 保存任务队列。

### OpenAI

```text
OPENAI_API_KEY="sk-your-key"
OPENAI_IMAGE_MODEL="gpt-image-1"
```

Worker 会调用 OpenAI Images API 生成图片。

### 应用端口

```text
BACKEND_PORT="4000"
FRONTEND_PORT="3000"
ADMIN_PORT="3001"
```

注意：当前脚本里 frontend 和 admin 的端口写在各自 `package.json` 中。

默认地址：

```text
用户端: http://localhost:3000
管理端: http://localhost:3001
后端:   http://localhost:4000
```

### 本地图片存储

```text
STORAGE_DRIVER="local"
LOCAL_STORAGE_DIR="./storage/generated"
PUBLIC_ASSET_BASE_URL="http://localhost:4000/generated"
```

开发环境默认把图片保存到：

```text
storage/generated/<taskId>/<index>.png
```

后端会通过下面的 URL 访问：

```text
http://localhost:4000/generated/<taskId>/<index>.png
```

### AWS S3

生产环境可以改用 S3：

```text
STORAGE_DRIVER="s3"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET="your-bucket"
S3_PUBLIC_BASE_URL="https://cdn.example.com"
```

当 `STORAGE_DRIVER=s3` 时，Worker 会把生成图片上传到 S3。

### Stripe

```text
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
STRIPE_PRICE_PRO_MONTHLY="price_xxx"
```

当前项目已经预留 Stripe Checkout API，后续可继续补 webhook 处理支付成功后的 Credits 发放。

## 初始化数据库

确保 PostgreSQL 已启动，并且已经创建数据库：

```sql
CREATE DATABASE ai_image_platform;
```

如果你使用本项目自带的 Docker Compose，就不需要手动创建数据库。`docker-compose.yml` 会自动创建：

```text
数据库名: ai_image_platform
用户名:   postgres
密码:     postgres
端口:     5432
```

然后生成 Prisma Client：

```bash
pnpm db:generate
```

执行数据库迁移：

```bash
pnpm db:migrate
```

打开 Prisma Studio：

```bash
pnpm db:studio
```

## 使用 Docker 启动 PostgreSQL 和 Redis

项目根目录已经提供 `docker-compose.yml`，用于本地启动 PostgreSQL 和 Redis。

启动：

```bash
pnpm infra:up
```

或者直接使用 Docker Compose：

```bash
docker compose up -d postgres redis
```

查看日志：

```bash
pnpm infra:logs
```

停止：

```bash
pnpm infra:down
```

启动成功后，端口应为：

```text
PostgreSQL: 127.0.0.1:5432
Redis:      127.0.0.1:6379
```

对应 `.env`：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_image_platform?schema=public"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD=""
```

## 启动项目，推荐方式

开发时建议分别打开 4 个终端窗口。

### 终端 1：启动用户端

```bash
pnpm dev:frontend
```

访问：

```text
http://localhost:3000
```

### 终端 2：启动管理端

```bash
pnpm dev:admin
```

访问：

```text
http://localhost:3001
```

### 终端 3：启动后端 API

```bash
pnpm dev:backend
```

访问健康检查：

```text
http://localhost:4000/health
```

### 终端 4：启动 Worker

```bash
pnpm dev:worker
```

Worker 会监听 Redis 队列，并处理 AI 生图任务。

## 一次性启动全部服务

也可以在根目录执行：

```bash
pnpm dev
```

这个命令会并行启动所有 workspace 的 dev 脚本。

如果你是第一次调试，建议先分别启动，方便观察日志。

## 使用 npm 启动说明

项目推荐 pnpm，但也保留了 npm workspace 的基础兼容。

### npm 安装依赖

```bash
npm install
```

### npm 开发模式启动

分别启动子应用：

```bash
npm run dev --workspace @ai/frontend
npm run dev --workspace @ai/admin
npm run dev --workspace @ai/backend
npm run dev --workspace @ai/worker
```

### npm 构建

```bash
npm run build --workspaces
```

### npm start

`npm start` 不是开发命令。它通常用于生产模式，必须先执行 build。

例如启动用户端：

```bash
npm run build --workspace @ai/frontend
npm run start --workspace @ai/frontend
```

启动管理端：

```bash
npm run build --workspace @ai/admin
npm run start --workspace @ai/admin
```

启动后端：

```bash
npm run build --workspace @ai/backend
npm run start --workspace @ai/backend
```

启动 Worker：

```bash
npm run build --workspace @ai/worker
npm run start --workspace @ai/worker
```

注意：如果你用 npm，根目录目前没有定义单独的 `npm start` 聚合命令。开发阶段更推荐使用 pnpm。

## 测试 AI 生图接口

启动 PostgreSQL、Redis、Backend 和 Worker 后，可以测试创建生图任务。

```bash
curl -X POST http://localhost:4000/api/generations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cinematic product photo of a glass perfume bottle on wet black stone",
    "size": "1024x1024",
    "quality": "auto",
    "outputFormat": "png",
    "count": 1
  }'
```

返回示例：

```json
{
  "taskId": "uuid",
  "status": "QUEUED",
  "pollingUrl": "/api/generations/uuid"
}
```

如果请求没有传 `userId`，后端会自动使用 `.env` 中的 `DEMO_USER_EMAIL` 创建或复用一个 Demo 用户。

## 查询任务状态

拿到 `taskId` 后查询：

```bash
curl http://localhost:4000/api/generations/<taskId>
```

可能状态：

```text
PENDING
QUEUED
PROCESSING
SUCCEEDED
FAILED
CANCELLED
BLOCKED
```

当状态为 `SUCCEEDED` 时，返回结果里的 `assets` 会包含生成图片 URL。

## 生图任务数据流

```text
用户输入 Prompt
  |
frontend 调用 backend
  |
backend 创建 GenerationTask
  |
backend 预扣 Credits
  |
backend 将 taskId 投递到 BullMQ
  |
Redis 保存队列任务
  |
worker 消费任务
  |
worker 调用 OpenAI Images API
  |
worker 保存图片到本地或 S3
  |
worker 写入 ImageAsset
  |
worker 更新 GenerationTask 状态
  |
frontend polling 查询结果
```

## Credits 机制

当前实现采用“预扣 + 失败退款”模式。

创建任务时：

```text
检查用户 Credits
扣除预计消耗
写入 CreditTransaction
创建 GenerationTask
投递队列
```

Worker 生成失败时：

```text
任务状态改为 FAILED
退回 Credits
写入退款流水
```

## 常见问题

### 1. 为什么必须启动 Redis？

因为 BullMQ 使用 Redis 存储任务队列。没有 Redis，后端无法投递任务，Worker 也无法消费任务。

### 2. 为什么前端点击生成后一直没有结果？

请检查：

- backend 是否启动
- worker 是否启动
- Redis 是否启动
- `.env` 里的 `OPENAI_API_KEY` 是否正确
- 数据库迁移是否执行

### 3. 生成图片保存在哪里？

默认保存在：

```text
storage/generated/
```

如果使用 S3，则保存到 `S3_BUCKET`。

### 4. 为什么不用前端直接调用 OpenAI？

因为 OpenAI API Key 不能暴露到浏览器。正确做法是：

```text
frontend -> backend -> queue -> worker -> OpenAI
```

### 5. Admin Dashboard 是否已经连接真实数据？

当前 admin 已经有页面结构，后端也提供了部分 admin API。后续可以把 admin 页面接入：

```text
GET /api/admin/metrics
GET /api/admin/users
GET /api/admin/tasks
```

## 推荐开发顺序

1. 配好 PostgreSQL、Redis、OpenAI API Key
2. 跑通 `POST /api/generations`
3. 确认 Worker 能生成图片
4. 接入用户登录
5. 完善图片历史记录
6. 接入 Stripe Webhook
7. 完善 Admin Dashboard 数据
8. 增加 S3/CDN 生产存储
9. 增加内容审核和权限系统

## 架构边界

```text
frontend -> backend API
admin    -> backend API
backend  -> PostgreSQL / Redis / Stripe
worker   -> PostgreSQL / Redis / OpenAI / S3
shared   -> 类型、Schema、队列协议
database -> Prisma schema、Prisma Client
```

重要原则：

- frontend 不直接访问数据库
- admin 不直接访问数据库
- worker 不暴露公共 HTTP API
- backend 负责鉴权和业务入口
- worker 负责耗时任务
- shared 只放通用类型和协议

## 生产部署建议

生产环境建议拆成独立服务：

```text
frontend.example.com  -> apps/frontend
admin.example.com     -> apps/admin
api.example.com       -> apps/backend
worker                -> apps/worker
PostgreSQL            -> 托管数据库
Redis                 -> 托管 Redis
S3                    -> 图片存储
CDN                   -> 图片加速
Stripe                -> 支付
```

生产启动通常是：

```bash
pnpm build
pnpm --filter @ai/frontend start
pnpm --filter @ai/admin start
pnpm --filter @ai/backend start
pnpm --filter @ai/worker start
```

实际部署时，frontend、admin、backend、worker 应该分别由不同进程或容器运行。
