"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 当菜单打开时，禁止背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/" onClick={closeMobileMenu}>
            <div className="logo-content">
              <Image src="/logo.svg" alt="TransferFiles" width={40} height={40} />
              <span className="logo-text">TransferFiles</span>
            </div>
          </Link>
        </div>
        
        {/* 桌面端导航 */}
        <nav className="main-nav desktop-nav">
          <ul>
            <li className={pathname === '/' ? 'active' : ''}>
              <Link href="/">Home</Link>
            </li>
            <li className={pathname === '/guide' ? 'active' : ''}>
              <Link href="/guide">Guide</Link>
            </li>
            <li className={pathname.startsWith('/blog') ? 'active' : ''}>
              <Link href="/blog">Blog</Link>
            </li>
            <li className={pathname === '/about' ? 'active' : ''}>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
        
        {/* 移动端菜单按钮 */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* 移动端导航 */}
        <div className={`mobile-nav-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <ul>
              <li className={pathname === '/' ? 'active' : ''}>
                <Link href="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li className={pathname === '/guide' ? 'active' : ''}>
                <Link href="/guide" onClick={closeMobileMenu}>Guide</Link>
              </li>
              <li className={pathname.startsWith('/blog') ? 'active' : ''}>
                <Link href="/blog" onClick={closeMobileMenu}>Blog</Link>
              </li>
              <li className={pathname === '/about' ? 'active' : ''}>
                <Link href="/about" onClick={closeMobileMenu}>About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 