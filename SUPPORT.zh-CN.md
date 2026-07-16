# 支持 — YouTube 色彩分析器

[Français](./SUPPORT.fr.md) | [English](./SUPPORT.md) | **中文** | [Español](./SUPPORT.es.md) | [Português](./SUPPORT.pt-BR.md)

## 获取帮助

- 支持邮箱：**[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**
- 问题跟踪器：**[待填写的公开问题跟踪器网址]**
- 隐私政策：[PRIVACY.zh-CN.md](./PRIVACY.zh-CN.md)
- 目标响应时间：**[待填写的时间，例如 5 个工作日]**

请勿发送包含个人信息、私人账户或机密内容的屏幕截图。本扩展程序绝不会要求您提供 YouTube 或 Google 密码。

## 快速检查

### 侧边栏一直处于等待状态

1. 使用 Google Chrome 116 或更高版本。
2. 打开标准的 `https://www.youtube.com/watch?...` 页面。
3. 安装或更新扩展程序后，重新加载页面。
4. 点击扩展程序图标，并在首次使用时接受数据披露。

### 分析已暂停

- 使用普通模式或影院模式；
- 退出全屏、YouTube 迷你播放器和画中画模式；
- 激活 YouTube 标签页；
- 确保完整的视频画面可见；
- 移开指针，使 YouTube 控件隐藏。

### 示波器未更新

- 确保视频已经有一帧解码画面；
- 点击“停止”，然后再次点击扩展程序图标；
- 如果扩展程序刚刚更新，请重新加载 YouTube 页面；
- 尝试另一个公开视频，以排除特定视频源自身的限制。

### 测量结果与 DaVinci Resolve 不同

版本 1 分析的是 Chrome 呈现的可见 SDR 输出。它无法访问原始视频文件、显示呈现之前的信号或完整的色彩元数据。这些示波器仅用于观察，并非经过校准的广播级测量工具。

字幕、控件和其他可见叠加元素也可能影响结果。

## 支持范围

- 标准 `youtube.com/watch` 页面；
- 普通模式和影院模式；
- YRGB/RGB 分量图、YRGB 波形图和 Rec.709 矢量示波器；
- 实时分析，以及暂停时更详细的画面分析。

版本 1 不支持 Shorts、YouTube Music、嵌入式播放器、全屏、YouTube 迷你播放器、画中画模式或经过校准的 HDR 分析。

## 报告问题

请提供以下信息，但不要附加敏感数据：

1. Chrome 版本；
2. 操作系统；
3. 扩展程序版本；
4. 页面类型和播放器模式；
5. 重现问题的步骤；
6. 实际结果和预期结果；
7. `chrome://extensions` 中显示的任何错误。

## 隐私与安全

如有数据相关问题或需要报告漏洞，请发送邮件至 **[dyvyn.7@gmail.com](mailto:dyvyn.7@gmail.com)**。请勿公开披露尚未修复的漏洞详情。

## 独立性声明

YouTube 色彩分析器是一个独立项目。它与 Google、YouTube 或 Blackmagic Design 均无隶属关系，也未获得这些公司的认可或赞助。
