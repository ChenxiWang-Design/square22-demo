# Railway 设置环境变量步骤

## 📍 Variables（环境变量）在哪里？

**重要**：Variables **不在 Settings 页面**，而是在 **Service（服务）页面**！

## 🔍 找到 Variables 的步骤

### 方法1：在 Service 页面（推荐）

1. **回到项目主页面**（不是Settings）
2. 点击你的 **Service**（服务名称，通常是你的项目名）
3. 在 Service 页面顶部，你会看到多个标签页：
   - **Deployments**（部署）
   - **Metrics**（指标）
   - **Variables** ← **在这里！**
   - **Settings**（设置）
   - **Logs**（日志）
4. 点击 **Variables** 标签页
5. 点击 **"New Variable"** 或 **"+"** 按钮
6. 添加：
   - **Key**: `CLAUDE_API_KEY`
   - **Value**: `你的API密钥`
7. 保存

### 方法2：在 Service Settings 中

1. 在 Service 页面
2. 点击 **Settings** 标签页
3. 向下滚动，找到 **"Variables"** 或 **"Environment Variables"** 部分
4. 点击 **"New Variable"** 添加

### 方法3：快速添加（部署时）

1. 在 Service 页面
2. 点击 **Deployments** 标签页
3. 找到最新的部署
4. 点击部署右侧的 **"..."** 菜单
5. 选择 **"View Variables"** 或类似选项

---

## 📸 Railway 界面结构

```
Railway 项目页面
├── Service（服务）← 点击这里！
│   ├── Deployments（部署历史）
│   ├── Metrics（性能指标）
│   ├── Variables ← 环境变量在这里！
│   ├── Settings（服务设置）
│   └── Logs（日志）
└── Settings（项目设置）← 你刚才看的这里
    ├── Source（源代码）
    ├── Networking（网络）
    ├── Build（构建）
    └── Deploy（部署）
```

---

## ✅ 设置步骤总结

1. **离开 Settings 页面**
2. **回到项目主页面**
3. **点击你的 Service**
4. **点击 Variables 标签页**
5. **添加环境变量**：
   ```
   Key: CLAUDE_API_KEY
   Value: sk-ant-api03-你的密钥...
   ```
6. **保存后，Railway 会自动重新部署**

---

## 💡 提示

- 添加环境变量后，**不需要手动重启**，Railway 会自动重新部署
- 环境变量修改后，新的部署会使用新的变量值
- 如果找不到 Variables，可能是：
  - Railway 界面版本不同
  - 需要先完成第一次部署
  - 尝试刷新页面

---

## 🆘 如果还是找不到

告诉我：
1. 你现在在哪个页面？（项目页面？Service页面？Settings页面？）
2. 你能看到哪些标签页？
3. 我可以帮你找到正确的位置！
