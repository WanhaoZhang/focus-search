# Focus Search - Safari 扩展安装指南

## 📦 Safari 版本文件

Safari 版本包含以下专用文件：
- `safari-manifest.json` - Safari 扩展配置文件
- `safari-newtab.html` - Safari 版本的 HTML 页面  
- `safari-newtab.js` - Safari 兼容的 JavaScript 代码
- `safari-newtab.css` - Safari 版本的样式文件

## 🔧 主要差异

### API 适配
- **存储 API**: 使用 `SafariStorage` 兼容层，优先使用 Safari 扩展 API，降级到 localStorage
- **快捷键**: 优化为 Safari 习惯
  - `Cmd + K` 聚焦搜索框（而非 Ctrl + K）
  - `Option + 1-4` 切换网站（而非 Alt + 1-4）

### 配置调整
- **Manifest 版本**: 使用 Manifest V2（Safari 兼容性更好）
- **内容安全策略**: 适配 Safari 的 CSP 要求
- **文件引用**: 所有文件名前缀为 `safari-`

## 📱 安装步骤

### 方法一：Safari Web Extensions（推荐）
1. 打开 Xcode
2. 创建新项目 → macOS → Safari Extension App
3. 将 Safari 版本文件复制到项目中
4. 构建并运行项目
5. 在 Safari 中启用扩展

### 方法二：Safari 开发者模式
1. 启用 Safari 开发菜单：Safari → 偏好设置 → 高级 → 勾选"在菜单栏中显示开发菜单"
2. 开发 → 允许未签名扩展
3. 将 Safari 文件夹拖拽到 Safari 扩展页面

## ⚙️ 功能特性

✅ **完整功能支持**
- 搜索知乎、小红书、抖音、B站
- 自定义网站添加/删除
- 搜索历史记录
- 网站图标颜色切换
- 响应式设计

✅ **Safari 特定优化**
- 原生 localStorage 存储支持
- Safari 快捷键适配
- macOS 风格交互

## 🔄 数据同步

Safari 版本使用 localStorage 存储数据，包括：
- `customSites` - 自定义网站配置
- `hiddenSites` - 隐藏的默认网站
- `searchHistory` - 搜索历史记录
- `hideTips` - 用户界面偏好设置

## 🚀 使用说明

### 快捷键
- `Cmd + K` - 聚焦搜索框
- `Option + 1-4` - 快速切换网站
- `ESC` - 关闭弹窗/历史面板
- `Enter` - 执行搜索/提交表单

### 添加自定义网站
1. 点击"添加网站"按钮
2. 填写网站名称、搜索地址、图标文字
3. 选择图标颜色
4. 点击"添加网站"完成

### 恢复默认网站
如果误删了默认网站，点击"添加网站"弹窗中的"恢复默认网站"按钮即可。

## 🛠️ 开发者说明

Safari 版本保持与 Chrome 版本完全独立，修改 Safari 文件不会影响 Chrome 版本。

核心技术栈：
- 原生 HTML/CSS/JavaScript
- Safari Extension APIs
- localStorage 数据持久化
- 响应式设计

## 📞 技术支持

如遇到问题，请检查：
1. Safari 版本是否支持扩展
2. 是否已启用开发者模式
3. 文件路径是否正确
4. 控制台是否有错误信息

---

**注意**: Safari 版本和 Chrome 版本数据不互通，需要分别配置。