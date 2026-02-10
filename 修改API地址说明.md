# 修改API地址 - 重要步骤

## ⚠️ 打包APP前必须修改！

手机APP不能访问 `localhost:3000`，必须使用公网API地址。

---

## 📝 修改步骤

### 1. 打开文件
编辑：`Register2/register2.js`

### 2. 找到这一行（大约715行）
```javascript
API_URL = 'http://localhost:3000/api/claude';
```

### 3. 改为你的公网API地址
```javascript
API_URL = 'https://your-api.railway.app/api/claude';
```

**替换说明：**
- `your-api.railway.app` → 替换为你的Railway部署地址
- 或者替换为其他公网API服务器地址

---

## 🔍 如何找到需要修改的位置

1. 打开 `Register2/register2.js`
2. 搜索：`localhost:3000`
3. 找到 `API_URL = 'http://localhost:3000/api/claude';`
4. 修改为公网地址

---

## ✅ 修改后验证

修改完成后：
1. 保存文件
2. 运行 `npx cap sync` 同步到Android项目
3. 重新构建APK

---

## 📋 如果没有公网API服务器

**必须先部署API服务器！**

查看：`重要-部署API服务器.md` 了解如何部署。
