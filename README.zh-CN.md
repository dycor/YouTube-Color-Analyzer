# YouTube Color Analyzer

[Français](./README.fr.md) | [English](./README.md) | **中文** | [Español](./README.es.md) | [Português](./README.pt-BR.md)

这是一款 Google Chrome 扩展，可在本地分析 YouTube 视频中当前可见的像素，并提供三种受 DaVinci Resolve 启发的监测工具：

- `YRGB` 或 `RGB` 分量图（Parade）；
- 波形图（Waveform），支持 `Y`、`R`、`G`、`B` 通道以及彩色或单色模式；
- Rec.709 矢量示波器（Vectorscope），带有色相参考标记和肤色线。

该扩展只观察画面，不会修改视频、视频源文件或其渲染结果。它不包含任何后端服务，不保存图像，也不会向互联网发送任何数据。

界面会自动采用浏览器的语言。支持法语、英语、中文、西班牙语和葡萄牙语；若浏览器语言不受支持，则默认使用英语。

## 项目状态

当前功能基础包括：

- 面向 Chrome 116 或更高版本的 Chrome MV3 清单；
- 带有三种监测工具及其设置的侧边栏；
- 本地处理管线：`tabCapture` → 离屏文档 → Web Worker → 侧边栏；
- 独立于 Chrome API 的 TypeScript 色彩分析核心；
- 单元测试、性能测试以及 Chromium 扩展加载测试。

本项目面向经典的 `youtube.com/watch` 页面，支持普通模式和影院模式。Shorts、嵌入式播放器、全屏模式、迷你播放器、画中画（Picture-in-Picture）以及经过校准的 HDR 分析不属于 V1 范围。

## 开发

前置要求：Node.js 22.12 或更高版本，以及 pnpm 10 或更高版本。

```bash
pnpm install
pnpm verify
```

可用命令：

```bash
pnpm dev        # 在发生更改时重新构建扩展
pnpm ui:preview # 启动界面预览服务器
pnpm typecheck  # 检查 TypeScript 类型
pnpm test       # 运行单元测试
pnpm build      # 生成 dist/ 目录
pnpm test:e2e   # 构建扩展，然后将其加载到 Chromium 中
pnpm site:build # 生成公开的 GitHub Pages 网站
pnpm assets:store # 重新生成 Chrome 应用商店图片
pnpm package:store # 创建并验证提交用 ZIP
```

若只想使用合成数据预览界面，请运行 `pnpm ui:preview`，然后在 Vite 显示的本地地址中打开 `/preview.html`。可通过 `?lang=` 参数检查某种语言，例如 `/preview.html?lang=zh-CN`。

## 在 Chrome 中加载扩展

1. 运行 `pnpm build`。
2. 打开 `chrome://extensions`。
3. 启用开发者模式。
4. 点击“加载已解压的扩展程序”。
5. 选择 `dist/` 目录。
6. 打开一个 `https://www.youtube.com/watch?...` 页面。
7. 点击扩展图标，阅读首次使用披露，并明确接受后开始分析。

## 架构

```text
src/
├── analyzer-worker/  计算三种监测工具的密度图
├── content-script/   YouTube 播放器的状态和几何信息
├── core/             可测试的色彩分析数学运算
├── offscreen/        捕获、裁剪和采样
├── service-worker/   MV3 生命周期和用户授权
├── shared/           消息协议和常量
└── sidepanel/        界面和 Canvas 2D 渲染
```

RGBA 图像始终保留在离屏文档和计算 worker 中。侧边栏仅接收绘制示波器所需的紧凑型强度图。

## 设计文档

- [`CONTEXT.md`](./CONTEXT.md) 定义了领域术语和范围。
- [`docs/adr/`](./docs/adr/) 包含在需求梳理过程中确认的产品和技术决策。

## 发布、隐私与支持

- [公开网站](https://dycor.github.io/YouTube-Color-Analyzer/zh-CN/)提供中文页面和语言切换器。
- [`PRIVACY.zh-CN.md`](./PRIVACY.zh-CN.md) 包含隐私政策及其其他语言版本链接。
- [`SUPPORT.zh-CN.md`](./SUPPORT.zh-CN.md) 包含支持和故障排除信息。
- [`docs/chrome-web-store/`](./docs/chrome-web-store/) 包含 Chrome 应用商店发布资料：本地化商品详情、数据披露、测试说明和检查清单。
- [`store-assets/`](./store-assets/) 包含生成的截图和宣传图片。

## 许可证

源代码根据 [Mozilla Public License 2.0](./LICENSE) 发布。重新分发时，对受该许可证覆盖文件所作的修改必须继续以 MPL 2.0 提供。本许可证不授予任何商标、商号或徽标的使用权。
