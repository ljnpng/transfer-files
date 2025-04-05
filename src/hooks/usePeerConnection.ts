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
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');
  const peerRef = useRef<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [peerLoaded, setPeerLoaded] = useState<boolean>(false);

  // 生成更复杂的随机 ID，减少冲突可能性
  const generateRandomId = () => {
    // 生成16个随机字符（更长更复杂）
    const randomPart = Array.from(
      { length: 16 },
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
    
    // 添加时间戳前缀进一步减少冲突
    return `tf-${Date.now().toString(36)}-${randomPart}`;
  }

  // 存储随机ID以便在重连时使用
  const randomIdRef = useRef<string>(generateRandomId());
  // 存储尝试重连次数，避免无限重连
  const reconnectAttempts = useRef<number>(0);
  // 存储handleDisconnect函数的引用
  const handleDisconnectRef = useRef<any>(null);
  // 存储setupConnection函数的引用
  const setupConnectionRef = useRef<any>(null);

  // Setup connection
  const setupConnection = useCallback((conn: any) => {
    setConnection(conn);
    
    console.log('Setting up connection:', conn.peer);
    
    conn.on('open', () => {
      console.log('Connection opened:', conn.peer);
      setConnectionStatus(`Connected to ${conn.peer}`);
      setConnected(true);
      if (options.onConnection) options.onConnection(conn);
    });
    
    conn.on('data', (data: any) => {
      console.log('Received data type:', data?.type);
      if (options.onData) options.onData(data);
    });
    
    conn.on('close', () => {
      console.log('Connection closed');
      setConnectionStatus('Connection closed');
      setConnected(false);
      setConnection(null);
      if (options.onConnectionClose) options.onConnectionClose();
    });
    
    conn.on('error', (error: any) => {
      console.error('Connection error:', error);
      setConnectionStatus('Connection error');
      if (options.onConnectionError) options.onConnectionError(error);
    });
    
    // Add connection timeout handling
    setTimeout(() => {
      if (conn.open === false) {
        console.log('Connection timed out');
        setConnectionStatus('Connection timed out, please try again');
      }
    }, 20000); // 20 seconds timeout
  }, [options]);

  // 保存setupConnection函数的引用
  useEffect(() => {
    setupConnectionRef.current = setupConnection;
  }, [setupConnection]);

  // Connect to peer
  const connectToPeer = useCallback((peerId: string) => {
    if (!peerRef.current) {
      console.error('Peer not initialized');
      return;
    }
    
    setConnectionStatus('Connecting...');
    const conn = peerRef.current.connect(peerId, {
      reliable: true
    });
    
    if (setupConnectionRef.current) {
      setupConnectionRef.current(conn);
    } else {
      setupConnection(conn);
    }
  }, [setupConnection]);

  // 处理断开连接的函数
  const handleDisconnect = useCallback(() => {
    if (!peerRef.current) return;
    
    console.log('Disconnected from PeerJS server, attempting to reconnect...');
    setConnectionStatus('Connection lost, attempting to reconnect...');
    
    // 限制重连尝试次数
    if (reconnectAttempts.current >= 3) {
      console.log('Maximum reconnection attempts reached');
      setConnectionStatus('Unable to reconnect. Please refresh the page.');
      return;
    }
    
    const attempt = reconnectAttempts.current;
    reconnectAttempts.current += 1;
    
    // 使用指数退避策略计算等待时间，重试次数越多，等待时间越长
    // 1次：2秒, 2次：4秒, 3次：8秒...
    const backoffTime = Math.min(2000 * Math.pow(2, attempt), 10000);
    
    console.log(`Reconnection attempt ${attempt + 1}, waiting ${backoffTime/1000} seconds...`);
    setConnectionStatus(`Connection lost, retrying in ${backoffTime/1000} seconds...`);
    
    // 尝试使用内置的重连方法
    if (typeof peerRef.current.reconnect === 'function') {
      try {
        (peerRef.current as any).reconnect();
        return;
      } catch (err) {
        console.error('Built-in reconnect failed:', err);
      }
    }
    
    // 创建新连接作为备选方案
    try {
      const oldPeer = peerRef.current;
      oldPeer.destroy();
      
      // 等待一段时间确保旧连接完全关闭，使用指数退避
      setTimeout(() => {
        try {
          const Peer = window.Peer;
          if (!Peer) {
            setConnectionStatus('PeerJS library not available');
            return;
          }
          
          // 生成一个新的随机ID，更加复杂且包含时间戳
          const newRandomId = generateRandomId();
          randomIdRef.current = newRandomId;
          
          console.log(`Creating new peer with ID: ${newRandomId}`);
          
          const newPeer = new Peer(newRandomId, {
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
            debug: 2
          });
          
          // 为新创建的对等连接添加事件监听器
          newPeer.on('open', (id: string) => {
            reconnectAttempts.current = 0; // 重置重连尝试计数
            setMyPeerId(id);
            setConnectionStatus('Reconnected, waiting for connection');
            console.log('PeerJS reconnection opened, ID:', id);
          });
          
          newPeer.on('connection', (conn: any) => {
            console.log('Connection request received after reconnect:', conn.peer);
            // 使用ref存储的setupConnection函数
            if (setupConnectionRef.current) {
              setupConnectionRef.current(conn);
            }
            setConnectionStatus(`Connected to ${conn.peer}`);
          });
          
          newPeer.on('error', (error: any) => {
            console.error('Peer connection error after reconnect:', error);
            let errorMsg = 'Connection error';
            if (error.type === 'peer-unavailable') {
              errorMsg = 'Remote device unavailable';
            } else if (error.type === 'network') {
              errorMsg = 'Network connection issue';
            } else if (error.type === 'disconnected') {
              errorMsg = 'Disconnected from server';
            } else if (error.type === 'server-error') {
              errorMsg = 'Server error';
            }
            setConnectionStatus(errorMsg);
          });
          
          // 为新连接添加断开事件处理
          if (handleDisconnectRef.current) {
            newPeer.on('disconnected', handleDisconnectRef.current);
          }
          
          peerRef.current = newPeer;
        } catch (err) {
          console.error('Failed to create new peer connection inside timeout:', err);
          setConnectionStatus('Reconnection failed');
        }
      }, backoffTime); // Wait for the old connection to close before creating a new one
    } catch (err) {
      console.error('Failed to create new peer connection:', err);
      setConnectionStatus('Reconnection failed');
    }
  }, []);

  // 保存handleDisconnect函数的引用以避免循环依赖
  useEffect(() => {
    handleDisconnectRef.current = handleDisconnect;
  }, [handleDisconnect]);

  // Send data
  const sendData = useCallback((data: any) => {
    if (connection) {
      connection.send(data);
      return true;
    }
    return false;
  }, [connection]);

  // Disconnect from current peer
  const disconnect = useCallback(() => {
    if (connection) {
      connection.close();
      setConnection(null);
      setConnected(false);
      setConnectionStatus('Not connected');
    }
  }, [connection]);

  // Check if Peer library is loaded
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

  // Initialize PeerJS
  useEffect(() => {
    // Check client environment and ensure Peer is loaded
    if (typeof window === 'undefined' || !peerLoaded) return;

    try {
      const Peer = window.Peer;
      // 使用已保存的随机ID
      const randomId = randomIdRef.current;
      
      // Add PeerJS configuration with multiple STUN/TURN servers
      const peer = new Peer(randomId, {
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
        debug: 2 // Increase debug information level
      });
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        setMyPeerId(id);
        setConnectionStatus('Online, waiting for connection');
        console.log('PeerJS connection opened, ID:', id);
      });

      peer.on('connection', (conn: any) => {
        console.log('Connection request received:', conn.peer);
        if (setupConnectionRef.current) {
          setupConnectionRef.current(conn);
        } else {
          setupConnection(conn);
        }
        setConnectionStatus(`Connected to ${conn.peer}`);
      });

      peer.on('error', (error: any) => {
        console.error('Peer connection error:', error);
        let errorMsg = 'Connection error';
        
        // Provide more specific error messages
        if (error.type === 'peer-unavailable') {
          errorMsg = 'Remote device unavailable';
        } else if (error.type === 'network') {
          errorMsg = 'Network connection issue';
        } else if (error.type === 'disconnected') {
          errorMsg = 'Disconnected from server';
        } else if (error.type === 'server-error') {
          errorMsg = 'Server error';
        }
        
        setConnectionStatus(errorMsg);
      });

      // Add additional handling 
      if (handleDisconnectRef.current) {
        peer.on('disconnected', handleDisconnectRef.current);
      }

      return () => {
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
      };
    } catch (err) {
      console.error('PeerJS initialization failed:', err);
      setConnectionStatus('Initialization failed');
    }
  }, [peerLoaded, setupConnection]);

  // Handle connection parameters in URL
  useEffect(() => {
    if (typeof window === 'undefined' || !myPeerId) return;
    
    const checkUrlForConnection = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const connectId = urlParams.get('connect');
      
      if (connectId && myPeerId) {
        connectToPeer(connectId);
        
        // Clear URL parameters to prevent reconnection on page refresh
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
    disconnect,
    peer: peerRef.current
  };
} 