# Focus Search - 双浏览器支持版本

## 📦 项目包含两个完整独立的版本：

### 🔵 Chrome 扩展版本
**文件列表：**
- `manifest.json` - Chrome扩展配置
- `newtab.html` - Chrome主页面
- `newtab.css` - Chrome样式文件
- `newtab.js` - Chrome JavaScript文件

### 🍎 Safari 扩展版本
**文件列表：**
- `safari-manifest.json` - Safari扩展配置
- `safari-newtab.html` - Safari主页面  
- `safari-newtab.css` - Safari样式文件
- `safari-newtab.js` - Safari JavaScript文件

## ⚠️ 重要说明

✅ **完全独立** - 两个版本互不影响，可以同时使用
✅ **功能一致** - 所有功能在两个浏览器中表现完全相同
✅ **数据隔离** - Chrome和Safari版本的数据完全分离

## 🚀 快速安装

### Chrome 版本
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择包含 `manifest.json` 的文件夹

### Safari 版本  
1. 参考 `Safari-安装指南.md` 详细说明
2. 使用Safari开发者模式安装
3. 或通过Xcode构建安装

## 📋 功能特性

🎯 **核心搜索功能**
- 知乎、小红书、抖音、B站快速搜索
- 自定义添加任意搜索网站
- 智能URL处理和搜索参数解析

🗂️ **网站管理**
- 一键删除任意网站（包括默认网站）
- 恢复默认网站功能
- 自定义网站图标和颜色

📊 **历史记录**
- 完整的搜索历史追踪
- 按时间排序和统计
- 单条删除和批量清空

🎨 **界面设计**  
- 现代化毛玻璃设计风格
- 响应式布局适配各种屏幕
- 流畅的动画和交互效果

⌨️ **快捷键支持**
- Chrome: `Ctrl/Cmd + K` 聚焦搜索
- Safari: `Cmd + K` 聚焦搜索  
- `Alt/Option + 1-4` 快速切换网站

## 🔄 版本区别

| 特性 | Chrome版本 | Safari版本 |
|-----|-----------|-----------|
| 存储API | chrome.storage.local | localStorage |
| 快捷键 | Ctrl/Cmd + K | Cmd + K |
| 数据同步 | Chrome账户同步 | 本地存储 |
| 自动更新 | Chrome商店 | 手动/App Store |

两个版本功能完全相同，只是底层API适配不同浏览器！