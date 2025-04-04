import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "设备间传输",
  description: "基于 WebRTC 的点对点文件传输工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
      </head>
      <body className={inter.className}>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
} 