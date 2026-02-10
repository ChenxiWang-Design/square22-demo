# GitHub推送代码 - 详细步骤

## 📋 前提条件

1. **已有GitHub账号**（如果没有，先注册：https://github.com）
2. **已安装Git**（Windows通常已安装，如果没有：https://git-scm.com/download/win）

---

## 🎯 步骤1：在GitHub创建仓库

### 1.1 登录GitHub
- 访问：https://github.com
- 登录你的账号

### 1.2 创建新仓库
1. 点击右上角的 **"+"** 按钮
2. 选择 **"New repository"**（新建仓库）

### 1.3 填写仓库信息
- **Repository name**（仓库名称）：输入 `square22-demo`（或任意名称，比如 `my-demo`）
- **Description**（描述）：可选，不填也可以
- **Public**（公开）：选择 **Public**（公开）
- **不要勾选** "Initialize this repository with a README"（不要初始化README）
- 点击 **"Create repository"**（创建仓库）

### 1.4 复制仓库地址
创建完成后，GitHub会显示一个页面，上面有仓库地址，类似：
```
https://github.com/你的用户名/square22-demo.git
```
**复制这个地址，后面要用！**

---

## 🎯 步骤2：在电脑上准备代码

### 2.1 打开命令行
- 按 `Win + R`
- 输入 `cmd`，回车
- 或者按 `Win + X`，选择"Windows PowerShell"

### 2.2 进入项目目录
```bash
cd c:\Users\24251\.cursor\Square22
```

---

## 🎯 步骤3：初始化Git仓库

### 3.1 检查是否已有Git仓库
```bash
git status
```

**情况A：显示"not a git repository"**
- 说明还没有初始化，继续步骤3.2

**情况B：显示文件列表**
- 说明已经有Git仓库，跳过步骤3.2，直接到步骤4

### 3.2 初始化Git仓库（如果没有）
```bash
git init
```

---

## 🎯 步骤4：添加文件到Git

### 4.1 添加所有文件
```bash
git add .
```
（这个命令会把当前目录所有文件添加到Git）

### 4.2 提交文件
```bash
git commit -m "Initial commit"
```
（这个命令会保存当前的文件状态）

---

## 🎯 步骤5：连接到GitHub仓库

### 5.1 设置主分支名称
```bash
git branch -M main
```
（这个命令设置分支名为main）

### 5.2 添加GitHub远程地址

**重要：替换下面的地址！**

找到你在步骤1.4复制的GitHub仓库地址，类似：
```
https://github.com/你的用户名/square22-demo.git
```

然后运行：
```bash
git remote add origin https://github.com/你的用户名/square22-demo.git
```

**示例：**
如果你的GitHub用户名是 `zhangsan`，仓库名是 `square22-demo`，那么命令是：
```bash
git remote add origin https://github.com/zhangsan/square22-demo.git
```

**如果显示"remote origin already exists"**
- 说明已经添加过了，运行：
```bash
git remote set-url origin https://github.com/你的用户名/square22-demo.git
```

---

## 🎯 步骤6：推送到GitHub

### 6.1 推送代码
```bash
git push -u origin main
```

### 6.2 输入GitHub账号密码
- 可能会要求输入GitHub用户名和密码
- **注意：** GitHub现在不支持密码登录，需要使用**Personal Access Token**（个人访问令牌）

---

## 🔑 如果提示需要密码：创建Personal Access Token

### 步骤1：创建Token
1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   - **Note**（备注）：输入 `deploy-token`（或任意名称）
   - **Expiration**（过期时间）：选择 `90 days`（或更长）
   - **Select scopes**（选择权限）：勾选 `repo`（全部仓库权限）
4. 点击 **"Generate token"**（生成令牌）
5. **重要：立即复制显示的Token**（类似：`ghp_xxxxxxxxxxxxxxxxxxxx`），关闭页面后就看不到了！

### 步骤2：使用Token推送
再次运行：
```bash
git push -u origin main
```

- **Username**（用户名）：输入你的GitHub用户名
- **Password**（密码）：**输入刚才复制的Token**（不是GitHub密码！）

---

## ✅ 完成！

推送成功后，刷新GitHub页面，应该能看到你的代码文件了！

---

## ❓ 常见问题

### Q: 如何查看我的GitHub用户名？
A: 登录GitHub后，右上角头像旁边就是你的用户名

### Q: 如何查看仓库地址？
A: 在GitHub仓库页面，点击绿色的 **"Code"** 按钮，会显示地址

### Q: 推送时显示"Authentication failed"？
A: 需要使用Personal Access Token，不要用GitHub密码

### Q: 推送时显示"Permission denied"？
A: 检查仓库地址是否正确，用户名和仓库名是否匹配

---

## 📝 完整命令示例

假设你的GitHub用户名是 `zhangsan`，仓库名是 `square22-demo`：

```bash
cd c:\Users\24251\.cursor\Square22
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/zhangsan/square22-demo.git
git push -u origin main
```

**记住：把 `zhangsan` 和 `square22-demo` 替换成你的实际用户名和仓库名！**
