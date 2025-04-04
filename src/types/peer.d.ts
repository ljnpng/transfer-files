// PeerJS库的类型声明文件

declare namespace PeerJS {
  interface PeerOptions {
    key?: string;
    host?: string;
    port?: number;
    path?: string;
    secure?: boolean;
    config?: RTCConfiguration;
    debug?: number;
  }

  interface DataConnection {
    send(data: any): void;
    close(): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    open: boolean;
    peer: string;
  }

  class Peer {
    constructor(id?: string, options?: PeerOptions);
    connect(id: string, options?: { reliable?: boolean }): DataConnection;
    on(event: string, callback: Function): void;
    disconnect(): void;
    destroy(): void;
  }
}

// 将Peer声明为全局变量
declare global {
  interface Window {
    Peer: typeof PeerJS.Peer;
  }
}

export {}; 