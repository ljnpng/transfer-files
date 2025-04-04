"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface PeerConnectionOptions {
  onConnection?: (connection: any) => void;
  onData?: (data: any) => void;
  onConnectionClose?: () => void;
  onConnectionError?: (error: any) => void;
}

export default function usePeerConnection(options: PeerConnectionOptions = {}) {
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [connection, setConnection] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('未连接');
  const peerRef = useRef<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [peerLoaded, setPeerLoaded] = useState<boolean>(false);

  // 检查 Peer 库是否已加载
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function checkPeerLoaded() {
      if (window.Peer) {
        setPeerLoaded(true);
        return true;
      }
      return false;
    }
    
    if (!checkPeerLoaded()) {
      const intervalId = setInterval(() => {
        if (checkPeerLoaded()) {
          clearInterval(intervalId);
        }
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  }, []);

  // 初始化PeerJS
  useEffect(() => {
    // 客户端环境检查 且 确保 Peer 已加载
    if (typeof window === 'undefined' || !peerLoaded) return;

    try {
      const Peer = window.Peer;
      const peer = new Peer();
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        setMyPeerId(id);
        setConnectionStatus('在线，等待连接');
      });

      peer.on('connection', (conn: any) => {
        setupConnection(conn);
        setConnectionStatus(`已连接到 ${conn.peer}`);
      });

      peer.on('error', (error: any) => {
        console.error('Peer连接错误:', error);
        setConnectionStatus('连接错误');
      });

      return () => {
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
      };
    } catch (err) {
      console.error('初始化 PeerJS 失败:', err);
      setConnectionStatus('初始化失败');
    }
  }, [peerLoaded]);

  // 连接到对等方
  const connectToPeer = useCallback((peerId: string) => {
    if (!peerRef.current) {
      console.error('Peer 未初始化');
      return;
    }
    
    setConnectionStatus('正在连接...');
    const conn = peerRef.current.connect(peerId, {
      reliable: true
    });
    
    setupConnection(conn);
  }, []);

  // 设置连接
  const setupConnection = useCallback((conn: any) => {
    setConnection(conn);
    
    conn.on('open', () => {
      setConnectionStatus(`已连接到 ${conn.peer}`);
      setConnected(true);
      if (options.onConnection) options.onConnection(conn);
    });
    
    conn.on('data', (data: any) => {
      if (options.onData) options.onData(data);
    });
    
    conn.on('close', () => {
      setConnectionStatus('连接已关闭');
      setConnected(false);
      setConnection(null);
      if (options.onConnectionClose) options.onConnectionClose();
    });
    
    conn.on('error', (error: any) => {
      console.error('连接错误:', error);
      setConnectionStatus('连接出错');
      if (options.onConnectionError) options.onConnectionError(error);
    });
  }, [options]);

  // 发送数据
  const sendData = useCallback((data: any) => {
    if (connection) {
      connection.send(data);
      return true;
    }
    return false;
  }, [connection]);

  // 处理URL中的连接参数
  useEffect(() => {
    if (typeof window === 'undefined' || !myPeerId) return;
    
    const checkUrlForConnection = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const connectId = urlParams.get('connect');
      
      if (connectId && myPeerId) {
        connectToPeer(connectId);
        
        // 清除URL参数，防止刷新页面时重复连接
        const newUrl = window.location.pathname;
        window.history.pushState({}, document.title, newUrl);
      }
    };
    
    checkUrlForConnection();
  }, [myPeerId, connectToPeer]);

  return {
    myPeerId,
    connection,
    connectionStatus,
    connected,
    connectToPeer,
    sendData,
    peer: peerRef.current
  };
} 