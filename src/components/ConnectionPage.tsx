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
  const [isCopied, setIsCopied] = useState(false);

  // 复制Peer ID到剪贴板
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(myPeerId)
      .then(() => {
        setCopyBtnText('已复制');
        setIsCopied(true);
        setTimeout(() => {
          setCopyBtnText('复制');
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 生成二维码
  useEffect(() => {
    if (!myPeerId || typeof window === 'undefined' || !qrcodeRef.current) return;
    
    // 使用类型断言检查QRCode是否存在
    const qrCode = (window as any).QRCode;
    if (!qrCode) return;

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
      qrcodeRef.current.width = 180;
      qrcodeRef.current.height = 180;
      
      // 使用QRCode库生成二维码
      qrCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 180,
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

  // 生成连接状态的类名
  const getStatusClassName = () => {
    if (connectionStatus.includes('已连接')) return 'status-connected';
    if (connectionStatus.includes('错误') || connectionStatus.includes('失败')) return 'status-error';
    if (connectionStatus.includes('正在连接')) return 'status-connecting';
    return '';
  };

  return (
    <div className="connection-panel">
      <div className="connection-info">
        <h2 className="connection-header">第一步：建立连接</h2>
        <div className="connection-guide">
          与另一台设备建立连接后，您将能够发送或接收文件和文本
        </div>
        
        <div className="connection-methods">
          <div className="id-section">
            <div className="section-label">方式一：使用ID连接</div>
            <div className="my-id-container">
              <div className="my-id-label">我的ID:</div>
              <div className={`my-id-value ${isCopied ? 'copied' : ''}`}>
                <span id="my-id">{myPeerId || "等待生成..."}</span>
                <button 
                  id="copy-id" 
                  className={`btn-small ${isCopied ? 'copied' : ''}`} 
                  onClick={copyIdToClipboard}
                >
                  {copyBtnText}
                </button>
              </div>
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
          </div>
          
          <div className="or-divider">
            <span>或</span>
          </div>
          
          <div className="qr-section">
            <div className="section-label">方式二：扫描二维码连接</div>
            <div id="qr-container">
              <canvas id="qrcode" ref={qrcodeRef}></canvas>
              <div id="share-url" className="share-url">
                <small>分享链接: 
                  <a href={`/scan?connect=${myPeerId}`} target="_blank" title={myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : ''}>
                    {myPeerId ? '点击查看' : '等待生成...'}
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`status-indicator ${getStatusClassName()}`}>
        <div className="status-icon"></div>
        <p>状态: <span id="connection-status">{connectionStatus}</span></p>
      </div>
    </div>
  );
} 