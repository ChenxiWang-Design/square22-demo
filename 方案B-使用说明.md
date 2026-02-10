# 方案B：localtunnel 使用说明

## 🚀 快速开始

### 第1步：安装 localtunnel（只需要一次）

打开命令行（Win+R，输入cmd，回车），运行：
```bash
npm install -g localtunnel
```

**等待安装完成即可。**

---

### 第2步：启动服务

**双击运行：`方案B-一键启动.bat`**

脚本会自动：
1. ✅ 检查localtunnel是否安装
2. ✅ 检查并安装依赖（如果需要）
3. ✅ 启动主服务器（端口8080）
4. ✅ 启动API代理（端口3000）
5. ✅ 启动localtunnel并显示URL

---

### 第3步：获取URL并访问

1. **查看localtunnel窗口**
   - 脚本会打开一个标题为"localtunnel-URL"的窗口
   - 等待几秒，会显示：
     ```
     your url is: https://xxxxx.loca.lt
     ```

2. **复制URL**
   - 复制显示的URL（例如：`https://xxxxx.loca.lt`）

3. **手机访问**
   - 打开手机浏览器
   - 输入或粘贴URL
   - 访问即可

---

## 📋 窗口说明

运行脚本后会打开3个窗口：

1. **主服务器-8080**
   - 显示：`主界面预览服务器已启动`
   - 保持打开，不要关闭

2. **API代理-3000**
   - 显示：`代理服务器运行在 http://localhost:3000`
   - 保持打开，不要关闭

3. **localtunnel-URL** ← **重要！**
   - 显示：`your url is: https://xxxxx.loca.lt`
   - **这个窗口里有你要的URL！**

---

## ⚠️ 注意事项

1. **三个窗口都要保持打开**
   - 关闭任何一个，对应服务会停止

2. **localtunnel URL会变化**
   - 每次启动localtunnel，URL都会不同
   - 这是正常的，免费版限制

3. **AI功能需要VPN**
   - 确保电脑已连接VPN
   - localtunnel只是转发，不影响VPN

4. **如果localtunnel连接失败**
   - 可能是网络问题
   - 关闭窗口，重新运行脚本

---

## 🔍 找不到URL怎么办？

### 方法1：查看所有窗口
- 使用 `Alt + Tab` 切换窗口
- 找到显示"your url is:"的窗口

### 方法2：重新启动localtunnel
- 关闭localtunnel窗口
- 打开命令行，运行：`lt --port 8080`
- 会显示新的URL

---

## ✅ 优势

- ✅ **不需要注册** - 直接使用
- ✅ **不需要配置** - 安装后直接用
- ✅ **完全免费** - 无限制
- ✅ **简单快速** - 一条命令搞定

---

## 🆚 对比ngrok

| 特性 | ngrok | localtunnel |
|------|-------|-------------|
| 需要注册 | ✅ 是 | ❌ 否 |
| 需要配置token | ✅ 是 | ❌ 否 |
| 安装后直接使用 | ❌ 否 | ✅ 是 |
| 免费 | ✅ 是 | ✅ 是 |

**localtunnel明显更简单！**

---

## 📝 完整流程

```
1. 安装：npm install -g localtunnel
2. 运行：方案B-一键启动.bat
3. 查看localtunnel窗口，复制URL
4. 手机浏览器访问URL
5. 测试功能
```

**就这么简单！**
