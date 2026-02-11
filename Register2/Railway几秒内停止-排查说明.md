# Railway 启动几秒内就停止 — 排查说明

## 你遇到的现象

- 在 Vercel 链接里用 R4，AI 对话依赖 Railway 的 API（`https://square22-demo-production.up.railway.app`）。
- Railway 部署 **start 后几秒内就 stop**。
- 心跳在 stopping 前一刻还在正常打，**没有任何报错**。

说明进程不是自己崩溃（否则会有 uncaughtException/unhandledRejection），而是**被平台结束**的。最常见原因：**健康检查失败** → Railway 认为服务没起来 → 发 SIGTERM 停掉。

---

## 最可能原因：跑错了 server.js + 端口不对

项目里有两个 `server.js`：

| 文件 | 监听端口 | 是否用 process.env.PORT | 是否有 /api/claude、/health |
|------|----------|-------------------------|-----------------------------|
| **根目录** `server.js` | 固定 **8080** | 否 | 否（只是静态预览） |
| **Register2/server.js** | **process.env.PORT \|\| 3000** | 是 | 是 |

- Railway 会把 **PORT**（例如 3000）注入环境变量，并在**这个端口**上做健康检查（请求 `/health` 等）。
- 若 **Root Directory 没设为 Register2**，构建/运行可能用的是**根目录**：
  - 跑起来的是根目录的 `server.js`，监听 **8080**；
  - Railway 去访问 **PORT（3000）** → 连不上 → 健康检查失败 → 几秒内判死并停掉服务。
- 进程本身还在跑（所以心跳正常），只是被平台 kill，所以**没有应用内报错**。

---

## 必做：在 Railway 里确认这两项

### 1. Root Directory 必须是 Register2

- 打开 Railway → 你的项目 → 点进 **Service**（服务卡片）。
- 进入 **Settings** → 找到 **Source** → **Root Directory**。
- 设为：**`Register2`**（不能为空、不能是项目根）。
- 保存后会自动重新部署。

这样构建和运行的上下文都是 Register2 目录，保证跑的是 **Register2/server.js**，会监听 `process.env.PORT`。

### 2. 环境变量 CLAUDE_API_KEY

- 同一 Service → **Variables**。
- 确认有 **CLAUDE_API_KEY**（你的 Anthropic API 密钥）。
- 若没有，Register2 的 server 会在启动时直接 `process.exit(1)`（一般看不到心跳就会退出了；你已有心跳说明可能已配置，但建议再确认一次）。

---

## 部署后如何确认

部署完成后，在 Railway 的 **Deployments** 里点进这次部署，看 **Logs**：

1. **看启动那一行**（我们新加了一行）  
   - 应类似：`[deploy] __dirname=/app | process.env.PORT=3000 | 监听端口=3000`  
   - 用 Docker 时 **__dirname** 通常是 `/app`（不会出现 Register2 字样）。重点看 **监听端口**：必须是 Railway 注入的 PORT（如 3000），不能是 8080。
2. 若看到 **监听端口=8080**，说明跑的是根目录的 server（静态预览服务），请再次确认 Root Directory = **Register2**。

然后：

- 浏览器访问：`https://square22-demo-production.up.railway.app/health`  
  应返回：`{"status":"ok"}`。
- 若 /health 能通，再在 Vercel 链接里试 R4 对话。

---

## 若 Root Directory 已正确仍几秒内停止

可再检查：

1. **Railway Service → Settings → Deploy**
   - 是否有自定义 **Health Check Path**？若有，设为 **`/health`**（不要带端口或完整 URL）。
   - 健康检查必须返回 **200**（我们 /health 已是 200）。

2. **Serverless（睡眠）**
   - Railway 的 Serverless 一般是“一段时间无流量后睡眠”，不会在**几秒内**就停。
   - 若你关掉了 Serverless 仍几秒就停，优先还是看健康检查 + Root Directory。

3. **用量/额度**
   - 看 Railway 项目是否有额度或限制导致立刻停用（相对少见）。

---

## 小结

- **现象**：几秒内 stop、心跳正常、无报错 → 多半是 **健康检查失败，平台把进程停掉**。
- **首要排查**：Railway 该 Service 的 **Root Directory = Register2**，Variables 里 **CLAUDE_API_KEY** 已设。
- **验证**：部署日志里看 `[deploy]` 的端口和 __dirname，再访问 `/health` 能 200。

按上面做完后，若仍然几秒就停，把 Railway 该次部署的**完整启动日志**（从启动到 stop 那几行）贴出来，可以再往下排查。
