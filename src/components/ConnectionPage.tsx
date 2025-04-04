"use client";

import { useState, useEffect, useRef } from 'react';

interface ConnectionPageProps {
  myPeerId: string;
  connectionStatus: string;
  onConnect: (peerId: string) => void;
}

export default function ConnectionPage({ myPeerId, connectionStatus, onConnect }: ConnectionPageProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('复制');
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  // 复制Peer ID到剪贴板
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(myPeerId)
      .then(() => {
        setCopyBtnText('已复制');
        setTimeout(() => {
          setCopyBtnText('复制');
        }, 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 生成二维码
  useEffect(() => {
    if (!myPeerId || typeof window === 'undefined' || !window.QRCode || !qrcodeRef.current) return;

    try {
      // 清空内容
      const context = qrcodeRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, qrcodeRef.current.width, qrcodeRef.current.height);
      }
      
      // 获取当前URL的基础部分（不包含查询参数）
      const baseUrl = window.location.origin + window.location.pathname;
      const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
      
      // 创建指向扫描页面的URL
      const scanUrl = `${basePath}scan?connect=${myPeerId}`;
      
      // 设置canvas大小
      qrcodeRef.current.width = 150;
      qrcodeRef.current.height = 150;
      
      // 使用QRCode库生成二维码
      window.QRCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#3498db',
          light: '#ffffff'
        }
      }, function (error: Error | null) {
        if (error) {
          console.error('QR Code 生成错误:', error);
        }
      });
    } catch (e) {
      console.error('QR Code 生成异常:', e);
    }
  }, [myPeerId]);

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
      <div className="connection-info">
        <h2>第一步：建立连接</h2>
        <div className="id-section">
          <p>我的ID: <span id="my-id">{myPeerId || "等待生成..."}</span> 
            <button id="copy-id" className="btn-small" onClick={copyIdToClipboard}>{copyBtnText}</button>
          </p>
        </div>
        <div className="connect-section">
          <input 
            type="text" 
            id="peer-id" 
            placeholder="输入对方ID" 
            value={peerIdInput}
            onChange={(e) => setPeerIdInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button id="connect-btn" className="btn" onClick={handleConnect}>连接</button>
        </div>
        <div id="qr-container">
          <h3>或扫描二维码连接</h3>
          <canvas id="qrcode" ref={qrcodeRef}></canvas>
          <div id="share-url" className="share-url">
            <small>或分享链接: <a href={`/scan?connect=${myPeerId}`} target="_blank">
              {myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : '等待生成...'}
            </a></small>
          </div>
        </div>
      </div>
      <div className="status">
        <p>状态: <span id="connection-status">{connectionStatus}</span></p>
      </div>
    </div>
  );
} 