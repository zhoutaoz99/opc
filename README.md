# 苏州园区一人公司注册 - 任务追踪

基于注册攻略拆解的可执行子任务追踪系统，帮助逐步完成一人公司注册全流程。

## 功能

- 6 大阶段、38 个子任务，按注册流程顺序排列
- 三种状态：待开始 / 进行中 / 已完成
- 每个任务可添加备注
- 按状态筛选、整体进度统计
- 数据持久化存储在 PostgreSQL 中

## 快速开始

### 前置要求

- [Docker](https://www.docker.com/)
- Node.js 18+

### 启动

```bash
# 1. 启动 PostgreSQL
docker compose up -d

# 2. 安装依赖
npm install

# 3. 初始化数据库表结构并填充任务数据
npm run seed

# 4. 启动服务
npm start
```

浏览器访问 http://localhost:3000

## 项目结构

```
├── docker-compose.yml       # PostgreSQL 容器配置
├── init-db.sql              # 数据库建表脚本（容器启动时自动执行）
├── server/
│   ├── db.js                # 数据库连接
│   ├── index.js             # Express API 服务
│   └── seed.js              # 任务数据填充脚本
├── public/
│   └── index.html           # 前端页面
├── 苏州园区一人公司注册攻略.md  # 原始攻略文档
└── package.json
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tasks` | 获取所有任务 |
| PATCH | `/api/tasks/:id` | 更新任务（状态/备注） |
| GET | `/api/stats` | 获取统计数据 |
| POST | `/api/tasks/reset` | 重置所有任务 |

### 示例

```bash
# 标记任务为已完成
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# 添加备注
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"notes":"已准备5个候选名称"}'
```

## 技术栈

- **前端**：原生 HTML/CSS/JS
- **后端**：Node.js + Express
- **数据库**：PostgreSQL 16 (Docker)
