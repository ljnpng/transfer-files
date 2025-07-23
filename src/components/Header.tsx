"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
            <div className="logo-content">
              <Image src="/logo.svg" alt="TransferFiles" width={40} height={40} />
              <span className="logo-text">TransferFiles</span>
            </div>
        </div>
      </div>
    </header>
  );
}