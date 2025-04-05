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
      // 添加PeerJS配置，包含多个STUN/TURN服务器
      const peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            { urls: 'stun:stun.stunprotocol.org:3478' }
          ],
          iceCandidatePoolSize: 10,
        },
        debug: 2 // 增加调试信息级别
      });
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        setMyPeerId(id);
        setConnectionStatus('Online, waiting for connection');
        console.log('PeerJS connection opened, ID:', id);
      });

      peer.on('connection', (conn: any) => {
        console.log('收到连接请求:', conn.peer);
        setupConnection(conn);
        setConnectionStatus(`已连接到 ${conn.peer}`);
      });

      peer.on('error', (error: any) => {
        console.error('Peer连接错误:', error);
        let errorMsg = '连接错误';
        
        // 提供更具体的错误信息
        if (error.type === 'peer-unavailable') {
          errorMsg = '对方设备不可用';
        } else if (error.type === 'network') {
          errorMsg = '网络连接问题';
        } else if (error.type === 'disconnected') {
          errorMsg = '已从服务器断开';
        } else if (error.type === 'server-error') {
          errorMsg = '服务器错误';
        }
        
        setConnectionStatus(errorMsg);
      });

      // 添加额外处理
      peer.on('disconnected', () => {
        console.log('Disconnected from PeerJS server, attempting to reconnect...');
        setConnectionStatus('Connection lost, attempting to reconnect...');
        
        // 尝试重新连接到服务器
        peer.reconnect();
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
    
    setConnectionStatus('Connecting...');
    const conn = peerRef.current.connect(peerId, {
      reliable: true
    });
    
    setupConnection(conn);
  }, []);

  // 设置连接
  const setupConnection = useCallback((conn: any) => {
    setConnection(conn);
    
    console.log('设置连接:', conn.peer);
    
    conn.on('open', () => {
      console.log('Connection opened:', conn.peer);
      setConnectionStatus(`Connected to ${conn.peer}`);
      setConnected(true);
      if (options.onConnection) options.onConnection(conn);
    });
    
    conn.on('data', (data: any) => {
      console.log('收到数据类型:', data?.type);
      if (options.onData) options.onData(data);
    });
    
    conn.on('close', () => {
      console.log('连接已关闭');
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
    
    // 增加连接超时处理
    setTimeout(() => {
      if (conn.open === false) {
        console.log('连接超时未建立');
        setConnectionStatus('连接超时，请重试');
      }
    }, 20000); // 20秒超时
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