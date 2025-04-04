"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectId = searchParams.get('connect');
  const [status, setStatus] = useState('正在初始化连接...');

  useEffect(() => {
    if (connectId) {
      setStatus('连接ID: ' + connectId);
      
      // 短暂延迟后重定向到主页并携带连接参数
      const timeout = setTimeout(() => {
        router.push(`/?connect=${connectId}`);
      }, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setStatus('未找到连接ID，请重新扫描');
    }
  }, [connectId, router]);

  return (
    <div className="container">
      <h1>正在连接到设备</h1>
      <p>二维码扫描成功，正在建立连接...</p>
      <div className="loader"></div>
      <p id="status">{status}</p>
      <a href="/" className="btn">返回主页</a>
    </div>
  );
} 