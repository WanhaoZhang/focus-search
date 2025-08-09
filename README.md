# Focus Search

<div align="center">

![Focus Search Logo](https://img.shields.io/badge/Focus-Search-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.1-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🔍 一个简洁高效的Chrome扩展，将新标签页转换为强大的中文平台搜索工具**

[安装扩展](#安装) · [功能特性](#功能特性) · [使用指南](#使用指南) · [开发文档](#开发文档)

</div>

## ✨ 功能特性

### 🎯 核心功能
- **🚀 快速搜索** - 一键搜索知乎、小红书、抖音、B站等热门中文平台
- **🏠 替换新标签页** - 每次打开新标签页都是一个简洁的搜索界面
- **📱 响应式设计** - 完美适配桌面端和移动端
- **🎨 精美界面** - 现代化设计，渐变背景，玻璃拟态效果

### 🛠️ 高级功能
- **📚 搜索历史** - 自动记录搜索历史，支持快速重复搜索
- **🎛️ 自定义网站** - 轻松添加你喜欢的搜索网站（如微博、快手等）
- **⌨️ 快捷键支持** - 支持 `Ctrl/Cmd + K` 快速聚焦搜索框
- **🗂️ 历史管理** - 支持删除单条记录或清空所有历史
- **💾 本地存储** - 所有数据本地存储，保护隐私

### 🎮 交互体验
- **🖱️ 悬停效果** - 精美的悬停动画和过渡效果
- **🌈 主题色彩** - 自定义网站图标颜色，个性化体验
- **📊 使用统计** - 显示今日搜索次数和总搜索次数
- **🔄 实时更新** - 搜索历史实时更新，无需刷新

## 📸 界面预览

### 主界面
- 简洁的搜索框设计
- 四个默认搜索平台（知乎、小红书、抖音、B站）
- 现代化的玻璃拟态风格

### 历史记录面板
- 侧边栏历史记录显示
- 支持折叠/展开
- 搜索统计信息

### 自定义添加网站
- 直观的添加网站弹窗
- 颜色选择器
- 智能URL处理

## 🚀 安装

### 方式一：Chrome Web Store（推荐）
> 暂未上架，敬请期待

### 方式二：开发者模式安装
1. 下载本项目到本地
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目文件夹
6. 安装完成！

### 方式三：打包安装
1. 下载 Releases 中的 `.crx` 文件
2. 拖拽到 Chrome 扩展管理页面
3. 确认安装

## 📖 使用指南

### 基本搜索
1. 打开新标签页
2. 在搜索框中输入关键词
3. 选择要搜索的平台（默认为知乎）
4. 按回车或点击搜索按钮

### 添加自定义网站
1. 点击「添加网站」按钮
2. 填写网站名称（如「微博」）
3. 填写搜索地址（如 `https://s.weibo.com/weibo?q=`）
4. 设置图标文字和颜色
5. 点击「添加网站」完成

### 搜索历史管理
1. 点击右下角的历史记录按钮
2. 查看最近的搜索记录
3. 点击记录可快速重新搜索
4. 支持删除单条记录或清空全部

### 快捷键
- `Ctrl/Cmd + K` - 聚焦搜索框
- `Alt + 1/2/3/4` - 快速切换搜索网站
- `ESC` - 关闭历史记录面板/弹窗

## 🔧 开发文档

### 技术栈
- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **扩展**: Chrome Extension Manifest V3
- **存储**: Chrome Storage API
- **样式**: CSS Grid + Flexbox + CSS Variables

### 项目结构
```
focus-search/
├── manifest.json          # 扩展配置文件
├── newtab.html            # 新标签页HTML
├── newtab.css             # 样式文件
├── newtab.js              # 主要逻辑
├── CLAUDE.md              # 项目说明
└── README.md              # 项目文档
```

### 核心文件说明

#### `manifest.json`
- 扩展基本信息和权限配置
- 使用 Manifest V3 规范
- 替换新标签页为 `newtab.html`

#### `newtab.html`
- 主界面结构
- 包含搜索框、网站选择、历史记录等组件
- 使用语义化HTML标签

#### `newtab.css`
- 现代化CSS设计
- 使用CSS Grid和Flexbox布局
- 玻璃拟态效果和动画
- 完整的响应式设计

#### `newtab.js`
- 核心业务逻辑
- 搜索功能实现
- 历史记录管理
- 自定义网站功能
- Chrome Storage API交互

### API 使用

#### Chrome Storage API
```javascript
// 保存数据
chrome.storage.local.set({ key: value });

// 读取数据
chrome.storage.local.get(['key'], function(result) {
    console.log(result.key);
});
```

#### 数据结构

**搜索记录**
```javascript
{
    keyword: "搜索关键词",
    site: "网站key",
    siteName: "网站显示名称", 
    timestamp: 1640995200000,
    id: "唯一标识符"
}
```

**自定义网站**
```javascript
{
    name: "网站名称",
    url: "搜索URL模板",
    icon: "图标文字",
    color: "#颜色值"
}
```

### 开发环境设置

1. **克隆项目**
```bash
git clone https://github.com/yourusername/focus-search.git
cd focus-search
```

2. **加载到Chrome**
- 打开 `chrome://extensions/`
- 启用开发者模式
- 点击「加载已解压的扩展程序」
- 选择项目文件夹

3. **开发调试**
- 修改代码后需要在扩展管理页面点击刷新按钮
- 使用Chrome DevTools调试JavaScript
- CSS修改可以实时预览

### 构建和发布

#### 准备发布包
```bash
# 创建发布文件夹
mkdir release
cp manifest.json newtab.* release/
```

#### 打包为.crx文件
1. 在扩展管理页面点击「打包扩展程序」
2. 选择项目文件夹
3. 生成.crx和.pem文件

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献流程
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范
- 使用 2 个空格缩进
- 遵循 ES6+ 语法规范
- 添加适当的注释
- 保持代码简洁清晰

### Issue 模板
报告 Bug 时请提供：
- Chrome 版本
- 扩展版本
- 重现步骤
- 预期行为
- 实际行为
- 截图（如适用）

## 📝 更新日志

### v1.1.0 (2024-12-XX)
- ✨ 新增自定义网站添加功能
- 🎨 优化界面设计，增加玻璃拟态效果
- 📱 改进响应式设计
- 🐛 修复搜索历史显示问题

### v1.0.0 (2024-XX-XX)
- 🎉 首个正式版本发布
- ⚡ 支持知乎、小红书、抖音、B站搜索
- 📚 搜索历史功能
- 🎨 现代化UI设计

## ❓ 常见问题

### Q: 为什么扩展无法正常工作？
A: 请确保：
- Chrome版本 > 88
- 已启用扩展
- 网络连接正常

### Q: 如何备份搜索历史？
A: 目前暂不支持导出，数据存储在本地Chrome中。

### Q: 能否添加更多默认网站？
A: 可以通过「添加网站」功能自定义添加任何搜索网站。

### Q: 扩展会收集我的数据吗？
A: 不会。所有数据都存储在本地，不会上传到任何服务器。

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- 感谢所有贡献者和用户的支持
- UI设计灵感来源于现代化的搜索引擎界面
- 图标使用了 [Feather Icons](https://feathericons.com/)

## 🔗 相关链接

- [Chrome扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [项目问题反馈](https://github.com/yourusername/focus-search/issues)

---

<div align="center">

**🌟 如果这个项目对你有帮助，请给它一个星标！**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>