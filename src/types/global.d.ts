// 全局类型声明文件

interface Window {
  // QRCode.js库的全局定义
  QRCode: {
    toCanvas: (
      canvas: HTMLCanvasElement, 
      text: string, 
      options?: {
        width?: number;
        margin?: number;
        color?: {
          dark?: string;
          light?: string;
        }
      }, 
      callback?: (error: Error | null) => void
    ) => void;
  };
  
  // PeerJS的全局定义
  Peer: any;
}

// 导出空对象以使TypeScript将此视为模块
export {}; 