"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface ConnectionPanelProps {
  myPeerId: string;
  connectionStatus: string;
  onConnect: (peerId: string) => void;
}

export default function ConnectionPanel({ myPeerId, connectionStatus, onConnect }: ConnectionPanelProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy');
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  // 生成QR码
  useEffect(() => {
    if (myPeerId && qrcodeRef.current) {
      const scanUrl = `${window.location.origin}/scan?connect=${myPeerId}`;
      QRCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: '#3498db',
          light: '#ffffff'
        }
      });
    }
  }, [myPeerId]);

  // 复制ID到剪贴板
  const copyIdToClipboard = () => {
    if (myPeerId) {
      navigator.clipboard.writeText(myPeerId).then(() => {
        setCopyBtnText('Copied!');
        setTimeout(() => setCopyBtnText('Copy'), 2000);
      });
    }
  };

  const handleConnect = () => {
    if (peerIdInput.trim()) {
      onConnect(peerIdInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <div className="connection-panel">
      <h2>Connection Setup</h2>
      
      <div className="my-id-container">
        <div className="my-id-label">My ID: </div>
        <div className="my-id-value">
          <span>{myPeerId || "Generating..."}</span>
          <button 
            className="btn-small" 
            onClick={copyIdToClipboard}
          >
            {copyBtnText}
          </button>
        </div>
      </div>
      
      <div className="connect-section">
        <input 
          type="text" 
          placeholder="Enter peer ID" 
          value={peerIdInput}
          onChange={(e) => setPeerIdInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={handleConnect}>Connect</button>
      </div>
      
      <div className="or-divider">
        <span>OR</span>
      </div>
      
      <div id="qr-container">
        <h3>Scan QR Code to Connect</h3>
        <canvas id="qrcode" ref={qrcodeRef}></canvas>
        <div className="share-url">
          Or share link: <a href={`/scan?connect=${myPeerId}`} target="_blank">
            {myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : 'Generating...'}
          </a>
        </div>
      </div>
      
      <div className={`status-indicator ${connectionStatus.includes('Connected') ? 'status-connected' : 
                                       connectionStatus.includes('Connecting') ? 'status-connecting' : 
                                       connectionStatus.includes('Error') ? 'status-error' : ''}`}>
        <div className="status-icon"></div>
        <div>Status: {connectionStatus}</div>
      </div>
    </div>
  );
} 