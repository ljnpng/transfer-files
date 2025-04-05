"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/">
            <div className="logo-content">
              <Image src="/logo.svg" alt="TransferFiles" width={40} height={40} />
              <span className="logo-text">TransferFiles</span>
            </div>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li className={pathname === '/' ? 'active' : ''}>
              <Link href="/">Home</Link>
            </li>
            <li className={pathname.startsWith('/blog') ? 'active' : ''}>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <a href="https://github.com/coderLim/share-anything" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 