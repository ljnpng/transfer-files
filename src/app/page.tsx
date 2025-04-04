"use client";

import { useState } from 'react';
import ConnectionPage from '@/components/ConnectionPage';
import TransferPage from '@/components/TransferPage';
import usePeerConnection from '@/hooks/usePeerConnection';

export default function Home() {
  // 处理接收的数据
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<any[]>([]);

  // 处理接收到的数据
  function handleReceivedData(data: any) {
    if (data.type === 'file') {
      // 接收文件
      const blob = new Blob([data.data], { type: data.dataType });
      const url = URL.createObjectURL(blob);
      
      setReceivedFiles(prev => [...prev, {
        name: data.name,
        size: data.size,
        url,
        type: data.dataType,
        id: Date.now().toString()
      }]);
    } else if (data.type === 'text') {
      // 接收文本
      setReceivedTexts(prev => [...prev, {
        content: data.content,
        timestamp: new Date(data.timestamp).toLocaleString(),
        id: Date.now().toString()
      }]);
    }
  }

  const { 
    myPeerId, 
    connectionStatus, 
    connection, 
    connected,
    connectToPeer, 
    sendData
  } = usePeerConnection({
    onData: handleReceivedData
  });

  return (
    <main>
      <h1>设备间传输</h1>
      
      {!connected ? (
        // 未连接时显示连接页面
        <ConnectionPage 
          myPeerId={myPeerId}
          connectionStatus={connectionStatus}
          onConnect={connectToPeer}
        />
      ) : (
        // 已连接时显示传输页面
        <TransferPage
          connectionStatus={connectionStatus}
          onReceivedData={handleReceivedData}
          sendData={sendData}
          receivedFiles={receivedFiles}
          receivedTexts={receivedTexts}
        />
      )}
    </main>
  );
} 