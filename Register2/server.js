/**
 * Claude API 代理服务器
 * 解决CORS问题，将API调用转发到Claude API
 * 
 * 使用方法：
 * 1. 安装依赖: npm install express cors
 * 2. 运行服务器: node server.js
 * 3. 服务器将在 http://localhost:3000 运行
 */

// 尝试加载 .env 文件（如果存在且安装了 dotenv）
try {
  require('dotenv').config();
} catch (_) {
  // dotenv 未安装，忽略
}

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const { execSync } = require('child_process');
let HttpsProxyAgent;
try {
  HttpsProxyAgent = require('https-proxy-agent').HttpsProxyAgent;
} catch (_) {}

const app = express();
const PORT = 3000;

// Railway 等平台：防止未捕获错误导致进程静默退出，便于在日志中看到原因
process.on('uncaughtException', function (err) {
  console.error('[uncaughtException]', err && err.message, err && err.stack);
});
process.on('unhandledRejection', function (reason, p) {
  console.error('[unhandledRejection]', reason, p);
});

// 最早注册 /health，避免受静态文件等中间件影响，Railway 健康检查可立即命中
app.get('/health', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: 'ok' });
});

// 最先处理跨域：对 /api/claude 的预检(OPTIONS)和后续请求都加上 CORS 头，避免 Vercel 访问 Railway 被拦
app.use('/api/claude', function (req, res, next) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 自动解析代理：环境变量 > Windows 系统代理 > 默认 7890（Clash 常见），无需在 bat 里手动 set
// 注意：在 Railway/Vercel 等云平台部署时，不使用本地代理
function getProxyUrl() {
  // 优先检查环境变量
  const fromEnv = process.env.HTTPS_PROXY || process.env.ANTHROPIC_PROXY || process.env.HTTP_PROXY;
  if (fromEnv) return { url: fromEnv, source: 'env' };
  
  // 在云平台（Railway/Vercel）上，不使用本地代理
  // Railway 会设置 RAILWAY_ENVIRONMENT_NAME 或 RAILWAY_ENVIRONMENT
  // Vercel 会设置 VERCEL
  const isCloudPlatform = process.env.RAILWAY_ENVIRONMENT_NAME || 
                          process.env.RAILWAY_ENVIRONMENT || 
                          process.env.VERCEL || 
                          process.env.RENDER ||
                          process.env.HEROKU_APP_NAME ||
                          // 如果不在Windows系统，也认为是云平台
                          (process.platform !== 'win32' && !process.env.HOME?.includes('Users'));
  
  if (isCloudPlatform) {
    console.log('检测到云平台环境，不使用本地代理');
    return { url: null, source: 'cloud-platform-no-proxy' };
  }
  
  // 仅在 Windows 本地环境检查系统代理
  if (process.platform === 'win32') {
    try {
      const out = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable 2>nul', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      if (out && out.includes('0x1')) {
        const serverOut = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer 2>nul', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const m = serverOut && serverOut.match(/ProxyServer\s+REG_SZ\s+(\S+)/);
        if (m && m[1]) {
          let addr = m[1].trim();
          if (addr.includes('=')) addr = addr.split(';').find(s => s.toLowerCase().startsWith('https='))?.split('=')[1] || addr.split(';')[0].split('=')[1] || addr;
          if (addr && !addr.startsWith('http')) addr = 'http://' + addr;
          if (addr) return { url: addr, source: 'system' };
        }
      }
    } catch (_) {}
  }
  
  // 本地开发环境默认使用 7890（Clash 常见端口）
  return { url: 'http://127.0.0.1:7890', source: 'default(7890)' };
}
const { url: PROXY_URL, source: PROXY_SOURCE } = getProxyUrl();
const proxyAgent = PROXY_URL && HttpsProxyAgent ? new HttpsProxyAgent(PROXY_URL) : null;
if (proxyAgent) {
  console.log('代理(来源:', PROXY_SOURCE + '):', PROXY_URL.replace(/:[^:@]+@/, ':****@'));
} else if (PROXY_SOURCE === 'cloud-platform-no-proxy') {
  console.log('云平台环境：不使用代理，直接访问 Anthropic API');
} else {
  console.log('未使用代理，直接访问 Anthropic API');
}

// 全局 CORS（其他路由也允许）
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 提供静态文件服务（HTML、CSS、JS等）
// 将根目录设置为父目录，以便访问 ../Pic/Register/ 中的图片
app.use(express.static(path.join(__dirname, '..')));
// 同时提供Register2目录的静态文件服务，确保register2.css和register2.js可以访问
app.use('/Register2', express.static(__dirname));

// Claude API 配置（优先使用环境变量，避免密钥过期导致 403）
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
if (!CLAUDE_API_KEY) {
  console.error('错误: 未设置 CLAUDE_API_KEY 环境变量');
  console.error('请设置环境变量: set CLAUDE_API_KEY=你的API密钥');
  console.error('或在 .env 文件中配置（需要安装 dotenv 包）');
  process.exit(1);
}

// 将 messages 规范为严格的 user/assistant 交替（Claude 要求，否则可能 403）
function getContentText(msg) {
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content) && msg.content[0] && msg.content[0].text) return msg.content[0].text;
  return String(msg.content || '');
}
function normalizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return messages;
  const out = [];
  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'assistant' : 'user';
    const content = getContentText(msg);
    if (out.length > 0 && out[out.length - 1].role === role) {
      out[out.length - 1].content = (out[out.length - 1].content || '') + '\n\n' + content;
    } else {
      out.push({ role, content });
    }
  }
  return out;
}

// 代理路由
app.post('/api/claude', async (req, res) => {
  console.log('收到API请求:', req.method, req.path);
  console.log('请求体:', JSON.stringify(req.body, null, 2));
  try {
    const { messages: rawMessages, system } = req.body;
    const messages = normalizeMessages(rawMessages || []);
    if (messages.length !== (rawMessages || []).length || JSON.stringify(messages) !== JSON.stringify(rawMessages)) {
      console.log('已规范 messages 为 user/assistant 交替:', messages.length, '条');
    }

    // 备选模型列表：先试权限要求较低的，再试 Opus（部分密钥无 Opus 权限会 403）
    const modelList = [
      'claude-3-5-haiku-20241022',   // Haiku 通常权限最宽
      'claude-3-haiku-20240307',
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229'
    ];
    
    // 添加超时控制（30秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    // 尝试每个模型，直到成功（同一模型 403 时先重试一次，间隔 2 秒，应对瞬时限制）
    let lastError = null;
    const doRequest = async (model, body) => {
      const opts = {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      };
      if (proxyAgent) opts.agent = proxyAgent;
      const response = await fetch(CLAUDE_API_URL, opts);
      return { response, data: await response.json() };
    };

    for (const model of modelList) {
      try {
        const requestBody = {
          model: model,
          max_tokens: 4096,
          messages: messages
        };
        if (system) requestBody.system = system;

        console.log(`尝试使用模型: ${model}`);
        let result = await doRequest(model, requestBody);
        let { response, data } = result;

        // 403 时先等 2 秒重试一次（可能是瞬时限制）
        if (!response.ok && (response.status === 403 || response.status === 401) && data.error && data.error.type === 'forbidden') {
          console.warn(`模型 ${model} 返回 403，2 秒后重试一次...`);
          await new Promise(r => setTimeout(r, 2000));
          result = await doRequest(model, requestBody);
          response = result.response;
          data = result.data;
        }

        if (!response.ok) {
          if (data.error && data.error.type === 'not_found_error' && data.error.message.includes('model:')) {
            console.log(`模型 ${model} 不可用，尝试下一个...`);
            lastError = data;
            continue;
          }
          if (response.status === 403 || response.status === 401) {
            console.warn(`模型 ${model} 返回 ${response.status}，尝试下一个模型...`);
            lastError = data;
            continue;
          }
          clearTimeout(timeoutId);
          console.error('Claude API错误:', data);
          return res.status(response.status).json(data);
        }

        clearTimeout(timeoutId);
        console.log(`成功使用模型: ${model}`);
        return res.json(data);
      } catch (error) {
        if (error.name === 'AbortError') {
          clearTimeout(timeoutId);
          console.error('请求超时');
          return res.status(504).json({ error: '请求超时，请稍后重试' });
        }
        // 网络错误等，直接抛出
        clearTimeout(timeoutId);
        throw error;
      }
    }
    
    // 所有模型都失败了
    clearTimeout(timeoutId);
    const is403 = lastError && lastError.error && (lastError.error.type === 'forbidden' || lastError.error.message === 'Request not allowed');
    console.error('所有模型均不可用，最后一个错误:', lastError);
    if (is403) {
      console.error('>>> 若密钥确认有效，请到 https://console.anthropic.com 确认该密钥为「API 密钥」且已开通 Messages API。');
      if (!proxyAgent) console.error('>>> 若你在中国大陆或请求出口在香港等非支持地区，请设置环境变量 HTTPS_PROXY（或 ANTHROPIC_PROXY）为可用的 HTTP 代理（支持地区的出口）后重启。详见项目内 403说明.md');
    }
    return res.status(is403 ? 403 : 404).json(lastError || { error: { type: 'error', message: '没有可用的模型' } });
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 根路径：返回移动端入口页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理Register2目录下的资源文件（CSS、JS等）
// 当HTML中使用相对路径时，需要这些路由来正确提供文件
app.get('/register2.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'register2.css'));
});
app.get('/register2.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'register2.js'));
});

// 获取Railway/Vercel等平台提供的端口，如果没有则使用3000
const HOST = '0.0.0.0'; // 绑定到所有网络接口，允许外部访问
const SERVER_PORT = process.env.PORT || PORT;

app.listen(SERVER_PORT, HOST, () => {
  console.log(`========================================`);
  console.log(`代理服务器运行在 http://${HOST}:${SERVER_PORT}`);
  console.log(`Claude API代理端点: http://${HOST}:${SERVER_PORT}/api/claude`);
  console.log(`健康检查端点: http://${HOST}:${SERVER_PORT}/health`);
  console.log(`移动端入口: http://${HOST}:${SERVER_PORT}/`);
  console.log(`API 密钥: ${process.env.CLAUDE_API_KEY ? '使用环境变量 CLAUDE_API_KEY' : '使用 server.js 内默认密钥'}`);
  console.log(`========================================`);
  // 心跳：每 5 秒打一条，用于判断是进程自己退出还是被 Railway 停掉
  setInterval(() => { console.log('[heartbeat] process alive'); }, 5000);
});

// 添加404处理，用于调试（必须在所有路由之后）
app.use((req, res) => {
  console.log(`404 - 未找到路由: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: '路由未找到', 
    method: req.method, 
    path: req.path,
    availableRoutes: ['POST /api/claude', 'GET /health']
  });
});
