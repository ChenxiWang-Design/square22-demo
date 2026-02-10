# Railway 设置 Root Directory 步骤

## ⚠️ 重要：Root Directory 不在 Project Settings！

**Root Directory 在 Service Settings，不在 Project Settings！**

---

## 🔍 找到 Root Directory 的正确步骤

### 步骤1：回到项目主页面

1. 你现在在 **Project Settings**（项目设置）
2. 点击左上角的 **项目名称** 或 **"←"** 返回按钮
3. 回到项目主页面（能看到 Service 卡片的地方）

### 步骤2：进入 Service Settings

1. 在项目主页面，你会看到一个 **Service**（服务卡片）
2. 点击这个 **Service**（不是项目名称）
3. 进入 Service 页面

### 步骤3：找到 Service Settings

1. 在 Service 页面顶部，你会看到标签页：
   ```
   [Deployments] [Variables] [Metrics] [Settings] [Logs]
                                          ↑
                                       点击这里！
   ```
2. 点击 **Settings** 标签页（这是 **Service Settings**，不是 Project Settings）

### 步骤4：找到 Root Directory

1. 在 Service Settings 页面
2. 向下滚动
3. 找到 **"Source"**（源代码）部分
4. 在 Source 部分中，你会看到：
   - **Root Directory** ← 在这里！
   - 可能还有其他选项如 "Watch Paths" 等

### 步骤5：设置 Root Directory

1. 在 **Root Directory** 输入框中
2. 输入：`Register2`
3. 点击 **Save** 或 **Update** 按钮
4. Railway 会自动重新部署

---

## 📸 Railway 界面结构

```
Railway 项目
├── Project Settings（项目设置）← 你刚才在这里
│   ├── General
│   ├── Usage
│   ├── Environments
│   └── ...
│
└── Service（服务）← 需要点击这里！
    ├── Deployments
    ├── Variables
    ├── Metrics
    ├── Settings ← Root Directory 在这里！
    │   ├── Source
    │   │   └── Root Directory ← 在这里！
    │   ├── Build
    │   └── Deploy
    └── Logs
```

---

## 🎯 快速操作流程

1. **离开 Project Settings**（点击返回或项目名称）
2. **点击 Service**（服务卡片）
3. **点击 Settings 标签页**（Service 的 Settings）
4. **找到 Source → Root Directory**
5. **设置为 `Register2`**
6. **保存**

---

## 💡 如果还是找不到

**可能的原因**：
1. Railway 界面版本不同
2. 需要先完成第一次部署
3. Root Directory 可能在 "Build" 或 "Deploy" 部分

**告诉我**：
- 你现在在哪个页面？
- 能看到 Service 卡片吗？
- Service Settings 中有哪些选项？

我可以帮你进一步定位！
