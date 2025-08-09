# Focus Search - Safari 扩展安装指南

## 📁 文件说明

Safari版本的Focus Search扩展包含以下文件：

- `safari-manifest.json` - Safari扩展配置文件
- `safari-newtab.html` - Safari主页面文件
- `safari-newtab.css` - Safari样式文件
- `safari-newtab.js` - Safari JavaScript文件

## 🍎 Safari 扩展安装方法

### 方法一：开发者模式安装（推荐）

1. **启用开发者模式**
   - 打开Safari浏览器
   - 菜单栏：Safari → 偏好设置 → 高级
   - 勾选"在菜单栏中显示'开发'菜单"

2. **创建扩展文件夹**
   ```bash
   mkdir ~/Desktop/FocusSearch-Safari
   cd ~/Desktop/FocusSearch-Safari
   ```

3. **复制Safari文件**
   - 将 `safari-manifest.json` 重命名为 `manifest.json`
   - 复制所有 `safari-*` 文件到扩展文件夹
   - 确保文件结构如下：
   ```
   FocusSearch-Safari/
   ├── manifest.json (原safari-manifest.json)
   ├── safari-newtab.html
   ├── safari-newtab.css
   └── safari-newtab.js
   ```

4. **安装扩展**
   - Safari菜单栏：开发 → 允许未签名的扩展
   - 开发 → 扩展管理器
   - 点击左下角的"+"按钮
   - 选择扩展文件夹
   - 启用扩展

### 方法二：打包安装

1. **创建Safari应用扩展项目**
   - 使用Xcode创建Safari App Extension项目
   - 将Safari文件添加到项目中
   - 构建并安装

## 🔧 功能特点

Safari版本与Chrome版本功能完全一致：

✅ **核心功能**
- 搜索知乎、小红书、抖音、B站
- 自定义添加搜索网站
- 删除不需要的网站
- 搜索历史记录管理

✅ **数据存储**
- 使用localStorage进行数据持久化
- 自定义网站配置保存
- 搜索历史保存
- 用户设置保存

✅ **快捷键支持**
- `Cmd + K`：聚焦搜索框
- `Option + 1-4`：快速切换搜索网站
- `ESC`：关闭弹窗

## 🔄 Chrome vs Safari 差异

| 功能 | Chrome版本 | Safari版本 |
|------|-----------|-----------|
| 数据存储 | chrome.storage.local | localStorage |
| 快捷键 | Ctrl/Cmd + K | Cmd + K |
| 网站切换 | Alt + 数字 | Option + 数字 |
| 扩展API | Chrome Extension API | Safari Extension API |

## 📝 注意事项

1. **Safari版本要求**
   - Safari 14+ (macOS Big Sur及以上)
   - 支持Safari Extension API

2. **数据隔离**
   - Safari版本的数据与Chrome版本完全独立
   - 不会影响Chrome扩展的数据

3. **自动更新**
   - 开发者模式安装的扩展需要手动更新
   - 正式版本通过App Store自动更新

## 🚀 使用指南

安装完成后：

1. **设置新标签页**
   - Safari → 偏好设置 → 通用
   - 新标签页打开方式：选择"Focus Search"

2. **开始使用**
   - 打开新标签页即可使用
   - 添加自定义搜索网站
   - 查看和管理搜索历史

## 🆘 故障排除

**扩展无法加载**
- 检查Safari版本是否支持
- 确认开发者模式已启用
- 重新安装扩展

**数据不保存**
- 检查Safari隐私设置
- 确认localStorage权限
- 清除浏览器缓存后重试

**功能异常**
- 查看Safari控制台错误信息
- 检查扩展权限设置
- 重启Safari浏览器

## 📞 技术支持

如有问题，请检查：
1. Safari版本兼容性
2. 扩展文件完整性
3. 浏览器权限设置
4. 控制台错误信息