# Capacitor打包方案 - 详细步骤

## 📱 关于开发者账号

### Android
- ❌ **不需要**开发者账号
- ✅ 可以直接生成APK并安装到手机
- ✅ 完全免费

### iOS
- ✅ **需要**Apple Developer账号（$99/年）
- ✅ 才能在真机安装
- ⚠️ 模拟器测试不需要账号（但功能有限）

**建议：先做Android版本，iOS后续需要时再做。**

---

## ⚠️ 重要前提：API代理服务器

**必须先部署API代理服务器到公网！**

手机APP不能访问 `localhost:3000`，需要：
1. 部署 `Register2/server.js` 到Railway/Vercel等平台
2. 获得公网API地址（例如：`https://your-api.railway.app/api/claude`）
3. 修改代码中的API地址

**如果没有公网API服务器，APP的AI功能无法使用！**

---

## 📋 步骤1：安装Capacitor

### 1.1 安装依赖
```bash
npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
```

### 1.2 初始化Capacitor
```bash
npx cap init
```

按提示输入：
- App name: `数字分身广场`（或你想要的名称）
- App ID: `com.yourname.square22`（例如：`com.square22.app`）
- Web dir: `./`（当前目录）

---

## 📋 步骤2：添加Android平台

### 2.1 添加Android
```bash
npx cap add android
```

### 2.2 同步文件
```bash
npx cap sync
```

---

## 📋 步骤3：配置Android

### 3.1 修改API地址

编辑 `Register2/register2.js`，找到：
```javascript
API_URL = 'http://localhost:3000/api/claude';
```

改为你的公网API地址：
```javascript
API_URL = 'https://your-api.railway.app/api/claude';
```

### 3.2 配置网络权限

编辑 `android/app/src/main/AndroidManifest.xml`，确保有：
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 📋 步骤4：构建APK

### 4.1 打开Android Studio
```bash
npx cap open android
```

### 4.2 在Android Studio中构建
1. 等待项目加载完成
2. 点击菜单：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. 等待构建完成

### 4.3 找到APK文件
构建完成后，APK位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 步骤5：安装到手机

### 方法1：USB连接
1. 手机开启"USB调试"
2. 连接电脑
3. 在Android Studio点击运行按钮

### 方法2：直接安装APK
1. 将 `app-debug.apk` 复制到手机
2. 手机设置 → 允许"未知来源"安装
3. 点击APK文件安装

---

## 🔧 配置说明

### capacitor.config.ts
已创建配置文件，包含：
- appId: `com.square22.app`
- appName: `数字分身广场`
- webDir: `./`
- Android配置

### Android配置
- 已配置网络权限
- 已配置应用图标和名称
- 已配置启动画面

---

## ⚠️ 常见问题

### 1. API调用失败
- 检查API地址是否正确
- 检查公网API服务器是否运行
- 检查网络权限配置

### 2. 构建失败
- 确保安装了Android Studio
- 确保Android SDK已安装
- 检查Java版本（需要JDK 11或更高）

### 3. 安装失败
- 检查手机是否允许"未知来源"
- 检查APK签名（debug版本可以直接安装）

---

## 📝 后续步骤

### 发布到Google Play（可选）
1. 生成签名APK
2. 注册Google Play开发者账号（$25一次性）
3. 上传APK

### iOS版本（需要Apple Developer账号）
1. 添加iOS平台：`npx cap add ios`
2. 打开Xcode：`npx cap open ios`
3. 配置证书和签名
4. 构建并安装

---

## 🎯 总结

**Android版本：**
- ✅ 不需要开发者账号
- ✅ 可以直接生成APK
- ✅ 免费

**iOS版本：**
- ⚠️ 需要Apple Developer账号（$99/年）
- ⚠️ 需要Mac电脑和Xcode

**建议：先完成Android版本，验证功能正常后再考虑iOS。**
