# Electron 桌面应用方案

## 概述

将 Register2 打包成桌面应用，可以像原生应用一样运行，完全避免浏览器UI遮挡问题。

## 方案优势

✅ **完全避免浏览器UI遮挡** - 应用窗口独立运行  
✅ **更好的用户体验** - 像原生应用一样  
✅ **跨平台支持** - Windows、macOS、Linux  
✅ **无需开发者账号** - 不需要iOS/Android开发者账号  
✅ **离线可用** - 可以打包所有资源  

## 快速开始

### 方案1：使用 Electron Forge（推荐，最简单）

1. **安装依赖**
```bash
cd Register2
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

2. **安装 Electron**
```bash
npm install --save-dev electron
```

3. **创建主进程文件** `main.js`：
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 360,
    height: 793,
    resizable: false, // 固定尺寸
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 开发环境：连接到本地服务器
  // 生产环境：可以打包静态文件
  win.loadURL('http://localhost:3000');
  
  // 或者打包后使用：
  // win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

4. **修改 package.json**，添加启动脚本：
```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "package": "electron-forge package",
    "make": "electron-forge make"
  }
}
```

5. **运行应用**
```bash
# 先启动服务器
node server.js

# 然后启动Electron应用（新终端）
npm start
```

6. **打包应用**
```bash
npm run make
```

### 方案2：使用 Electron Builder（更专业）

1. **安装依赖**
```bash
npm install --save-dev electron-builder
```

2. **修改 package.json**：
```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.yourcompany.register2",
    "productName": "数字分身注册",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "icon.icns"
    }
  }
}
```

3. **打包**
```bash
npm run build:win  # Windows
npm run build:mac  # macOS
```

## 完整示例文件

### main.js（完整版，支持开发和生产环境）

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// 启动本地服务器
function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    serverProcess.on('error', reject);
    
    // 等待服务器启动
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 793,
    resizable: false,
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // 开发环境：连接到本地服务器
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // 开发工具
  } else {
    // 生产环境：加载打包的HTML文件
    mainWindow.loadFile('index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // 启动服务器
  await startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

## 使用建议

### 开发阶段
1. 使用方案1（Electron Forge）快速测试
2. 保持服务器运行，Electron窗口连接到 `http://localhost:3000`
3. 修改代码后刷新窗口即可看到效果

### 生产阶段
1. 使用方案2（Electron Builder）打包
2. 可以选择：
   - **方案A**：打包成独立应用，内置服务器（需要打包Node.js运行时）
   - **方案B**：应用只包含前端，连接到Railway/Vercel服务器

## 注意事项

1. **服务器地址**：如果打包后连接到Railway，需要修改 `main.js` 中的URL
2. **资源路径**：确保所有静态资源路径正确
3. **API调用**：确保API端点可以跨域访问（已在server.js中配置CORS）

## 对比其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **PWA（添加到主屏幕）** | 无需安装，跨平台 | 浏览器UI可能遮挡 |
| **Electron桌面应用** | 完全独立，无遮挡 | 需要打包，文件较大 |
| **浏览器全屏模式** | 简单快速 | 需要用户手动操作 |

## 推荐流程

1. **先尝试PWA方案**（已优化viewport和CSS）
   - 在手机上访问Railway链接
   - 使用浏览器"添加到主屏幕"功能
   - 全屏运行，浏览器UI会隐藏

2. **如果PWA仍有问题，使用Electron**
   - 按照上述步骤创建桌面应用
   - 在Windows/Mac上运行，完全无遮挡
