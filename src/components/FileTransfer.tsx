"use client";

import { useState, useEffect, useRef } from 'react';
import ConnectionPanel from './ConnectionPanel';
import TransferPage from './TransferPage';
import usePeerConnection from '@/hooks/usePeerConnection';
import { formatFileSize, showToast } from '@/utils/helpers';

interface FileItem {
  file: File;
  id: string;
}

interface ReceivedFile {
  name: string;
  size: number;
  url: string;
  type: string;
  id: string;
}

interface ReceivedText {
  content: string;
  timestamp: string;
  id: string;
}

export default function FileTransfer() {
  // 使用自定义钩子处理WebRTC连接
  const {
    peer,
    connection,
    connectionStatus,
    connectToPeer,
    myPeerId
  } = usePeerConnection();
  
  // 本地状态
  const [connectStep, setConnectStep] = useState<'connect' | 'transfer'>('connect');
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<ReceivedText[]>([]);
  
  // 建立连接
  const handleConnect = (peerId: string) => {
    if (!peerId.trim()) {
      showToast('请输入有效的连接ID', true);
      return;
    }
    
    connectToPeer(peerId);
  };
  
  // 处理接收到的数据
  const handleReceivedData = (data: any) => {
    if (!data) return;
    
    if (data.type === 'file') {
      // 处理接收到的文件
      try {
        const { name, size, dataType, data: fileData } = data;
        
        // 创建Blob对象
        const blob = new Blob([fileData], { type: dataType });
        const url = URL.createObjectURL(blob);
        
        // 添加到已接收文件列表
        setReceivedFiles(prev => [
          {
            name,
            size,
            url,
            type: dataType,
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
          },
          ...prev
        ]);
        
        showToast(`已接收文件: ${name}`);
      } catch (error) {
        console.error('处理接收文件失败:', error);
        showToast('文件接收失败', true);
      }
    } else if (data.type === 'text') {
      // 处理接收到的文本
      try {
        const { content, timestamp } = data;
        
        // 添加到已接收文本列表
        setReceivedTexts(prev => [
          {
            content,
            timestamp,
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
          },
          ...prev
        ]);
        
        showToast('已接收新消息');
      } catch (error) {
        console.error('处理接收文本失败:', error);
        showToast('消息接收失败', true);
      }
    }
  };
  
  // 发送数据
  const sendData = (data: any): boolean => {
    if (!connection || connection.open === false) {
      showToast('未连接，无法发送数据', true);
      return false;
    }
    
    try {
      connection.send(data);
      return true;
    } catch (error) {
      console.error('发送数据失败:', error);
      return false;
    }
  };
  
  // 断开连接
  const handleDisconnect = () => {
    // 关闭连接
    if (connection) {
      connection.close();
    }
    
    if (peer) {
      peer.disconnect();
      peer.destroy();
    }
    
    // 重置状态
    setConnectStep('connect');
    setReceivedFiles([]);
    setReceivedTexts([]);
    
    // 显示通知
    showToast('已断开连接');
  };
  
  // 在连接状态变化时更新步骤
  useEffect(() => {
    if (connectionStatus.includes('已连接')) {
      setConnectStep('transfer');
    }
  }, [connectionStatus]);
  
  // 在连接对象上添加数据处理
  useEffect(() => {
    if (!connection) return;
    
    // 处理接收到的数据
    connection.on('data', handleReceivedData);
    
    return () => {
      connection.off('data', handleReceivedData);
    };
  }, [connection]);
  
  return (
    <div className="container">
      <h1>设备间传输</h1>
      
      {connectStep === 'connect' ? (
        <ConnectionPanel 
          myPeerId={myPeerId} 
          connectionStatus={connectionStatus}
          onConnect={handleConnect}
        />
      ) : (
        <TransferPage 
          connectionStatus={connectionStatus}
          onReceivedData={handleReceivedData}
          sendData={sendData}
          receivedFiles={receivedFiles}
          receivedTexts={receivedTexts}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
} 