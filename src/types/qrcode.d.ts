// QRCode.js库的类型声明文件

declare namespace QRCode {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toCanvas(
    canvas: HTMLCanvasElement, 
    text: string, 
    options?: QRCodeOptions, 
    callback?: (error: Error | null) => void
  ): void;
}

// 将QRCode声明为全局变量
declare global {
  interface Window {
    QRCode: typeof QRCode;
  }
}

export {}; 