# Share Anything - 设备间文件传输工具

这是一个基于 Next.js、WebRTC 和 PeerJS 的点对点文件/图片/文本传输工具，不依赖中央服务器进行数据传输。

## 功能特点

- 📱 支持不同设备间的文件传输（电脑、手机、平板等）
- 🔒 点对点直接传输，数据不经过服务器
- 📄 支持传输文本、图片和任意类型文件
- 🖱️ 支持拖放文件上传
- 📋 可通过ID或二维码建立连接
- 🖼️ 支持图片预览和复制到剪贴板

## 系统要求

- Node.js v18.18.0 或以上版本
- 支持 WebRTC 的浏览器（Chrome, Firefox, Safari, Edge 等现代浏览器）

## 使用方法

1. 确保使用正确的 Node.js 版本（v18+）

2. 安装依赖：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 访问应用：
   - 本机访问：http://localhost:3000
   - 局域网内其他设备访问：http://你的IP地址:3000

5. 获取连接方式：
   - 分享你的 Peer ID 给对方
   - 或让对方扫描生成的二维码

6. 建立连接：
   - 在另一台设备上访问应用
   - 输入第一台设备的 ID 并点击"连接"
   - 或扫描第一台设备显示的二维码

7. 开始传输文件或文本

## 构建生产版本

```bash
npm run build
npm run start
# 或
yarn build
yarn start
# 或
pnpm build
pnpm start
```

## 注意事项

- 在本地网络中，其他设备可以通过你的 IP 地址访问此应用
- WebRTC 连接需要双方设备都能访问互联网
- 大文件传输可能需要耐心等待
- 部分旧浏览器可能不支持 WebRTC 功能

## 技术栈

- Next.js (React 框架)
- TypeScript (类型安全的 JavaScript)
- WebRTC (点对点通信)
- PeerJS (WebRTC 封装库)
- React Hooks (状态管理)

## 许可

ISC License 