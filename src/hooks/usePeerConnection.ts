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
      // Add PeerJS configuration with multiple STUN/TURN servers
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
        setupConnection(conn);
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
      peer.on('disconnected', () => {
        console.log('Disconnected from PeerJS server, attempting to reconnect...');
        setConnectionStatus('Connection lost, attempting to reconnect...');
        
        // Attempt to reconnect to the server
        peer.reconnect();
      });

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
  }, [peerLoaded]);

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
    
    setupConnection(conn);
  }, []);

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

  // Send data
  const sendData = useCallback((data: any) => {
    if (connection) {
      connection.send(data);
      return true;
    }
    return false;
  }, [connection]);

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
    peer: peerRef.current
  };
} 