"use client";

import { useState, useEffect, useRef } from 'react';
import FileTransfer from "@/components/FileTransfer";

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");
  const [myPeerId, setMyPeerId] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<any[]>([]);
  
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const testimonialsWrapper = testimonialsRef.current;
    if (!testimonialsWrapper) return;
    
    // 设置自动轮播
    const autoScroll = () => {
      const scrollAmount = testimonialsWrapper.offsetWidth * 0.33;
      const maxScroll = testimonialsWrapper.scrollWidth - testimonialsWrapper.offsetWidth;
      const currentScroll = testimonialsWrapper.scrollLeft;
      
      // 如果已经滚动到最右侧，则回到开始位置
      if (currentScroll >= maxScroll - 10) {
        testimonialsWrapper.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // 否则继续向右滚动
        testimonialsWrapper.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    };
    
    // 每5秒自动滚动一次
    const interval = setInterval(autoScroll, 5000);
    
    // 当鼠标悬停在轮播上时暂停自动滚动
    const pauseAutoScroll = () => clearInterval(interval);
    const resumeAutoScroll = () => {
      clearInterval(interval);
      return setInterval(autoScroll, 5000);
    };
    
    testimonialsWrapper.addEventListener('mouseenter', pauseAutoScroll);
    testimonialsWrapper.addEventListener('mouseleave', resumeAutoScroll);
    
    return () => {
      clearInterval(interval);
      if (testimonialsWrapper) {
        testimonialsWrapper.removeEventListener('mouseenter', pauseAutoScroll);
        testimonialsWrapper.removeEventListener('mouseleave', resumeAutoScroll);
      }
    };
  }, []);
  
  // 生成随机头像URL
  const getRandomAvatar = (userId: number) => {
    // 使用以下API之一生成随机头像
    const avatarServices = [
      `https://i.pravatar.cc/150?u=${userId}`,
      `https://randomuser.me/api/portraits/${userId % 2 ? 'men' : 'women'}/${userId % 70}.jpg`,
      `https://avatars.dicebear.com/api/human/${userId}.svg`
    ];
    
    return avatarServices[userId % avatarServices.length];
  };
  
  return (
    <main className="app-content">
      <FileTransfer />
      
      <section className="seo-content">
        <div className="seo-container">
          <h2>TransferFiles - Fast P2P File Sharing Without Installations</h2>
          <p>TransferFiles is a secure, browser-based peer-to-peer file sharing solution that allows instant transfer of files and text messages between devices without software installation, account creation, or third-party servers.</p>
          
          <h3>How to Use TransferFiles</h3>
          <div className="usage-steps">
            <div className="step">
              <h4>Step 1: Connect Devices</h4>
              <p>Generate a unique ID and share it with the recipient through the QR code or link. The other person can scan the QR code or enter your ID to establish a secure connection.</p>
            </div>
            <div className="step">
              <h4>Step 2: Select Content</h4>
              <p>Choose files to send by dragging and dropping them into the upload area or by clicking the "Choose Files" button. For text messages, simply type or paste your content in the text tab.</p>
            </div>
            <div className="step">
              <h4>Step 3: Instant Transfer</h4>
              <p>Once connected, your files or messages are transferred directly to the other device through an encrypted peer-to-peer connection, bypassing any servers.</p>
            </div>
          </div>
          
          <h3>TransferFiles Features</h3>
          <ul className="features-list">
            <li>
              <strong>No Registration Required</strong>
              <p>Use TransferFiles instantly without creating accounts or providing personal information.</p>
            </li>
            <li>
              <strong>Direct P2P Connection</strong>
              <p>Files transfer directly between devices without passing through servers, ensuring maximum privacy.</p>
            </li>
            <li>
              <strong>Multi-Content Support</strong>
              <p>Send images, documents, videos, and text messages seamlessly between devices.</p>
            </li>
            <li>
              <strong>Cross-Platform Compatibility</strong>
              <p>Works on any device with a modern web browser - computers, tablets, and smartphones.</p>
            </li>
            <li>
              <strong>Secure Transmission</strong>
              <p>All transfers are encrypted end-to-end using WebRTC technology.</p>
            </li>
          </ul>
          
          <h3>Why Choose TransferFiles</h3>
          <div className="benefits">
            <div className="benefit">
              <h4>Privacy-Focused</h4>
              <p>Your files are never stored on our servers. Direct device-to-device transfer means your data remains private.</p>
            </div>
            <div className="benefit">
              <h4>No Size Limits</h4>
              <p>Transfer files of any size without the restrictions typically imposed by email or messaging platforms.</p>
            </div>
            <div className="benefit">
              <h4>Lightning Fast</h4>
              <p>Direct peer-to-peer connections offer faster transfer speeds than traditional cloud-based solutions.</p>
            </div>
            <div className="benefit">
              <h4>No Installation</h4>
              <p>Skip the download and installation process - just open the website and start sharing.</p>
            </div>
          </div>
          
          <h3>Use Cases for TransferFiles</h3>
          <div className="use-cases">
            <div className="use-case">
              <h4>Quick File Sharing</h4>
              <p>Instantly share photos, documents, or videos with colleagues during meetings without email delays.</p>
            </div>
            <div className="use-case">
              <h4>Cross-Device Transfer</h4>
              <p>Move files between your personal devices without cloud services or USB drives.</p>
            </div>
            <div className="use-case">
              <h4>Temporary Sharing</h4>
              <p>Share sensitive information that doesn't need to be stored long-term in cloud services.</p>
            </div>
            <div className="use-case">
              <h4>Off-Network Transfers</h4>
              <p>Transfer files on local networks even when internet access is limited or unavailable.</p>
            </div>
          </div>
          
          <h3>Technical Background</h3>
          <p>TransferFiles utilizes WebRTC (Web Real-Time Communication) technology, an open-source project that enables direct peer-to-peer communication between browsers. This technology allows for secure, real-time audio, video, and data transfers without plugins or additional software.</p>
          <p>The connection is established through a process called signaling, which helps peers discover each other. Once connected, all data transfers occur directly between devices, ensuring privacy and speed.</p>
          
          <h3>User Reviews</h3>
          <div className="testimonials-container">
            <div className="testimonials-wrapper" ref={testimonialsRef}>
              <div className="testimonials">
                <div className="testimonial">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={getRandomAvatar(1)} alt="User Avatar" />
                    </div>
                    <div className="testimonial-user">
                      <h4>Sarah Johnson</h4>
                      <span className="testimonial-date">May 15, 2023</span>
                    </div>
                  </div>
                  <p className="testimonial-content">
                    "TransferFiles saved me when I needed to quickly share a large presentation with my team. The direct file transfer was lightning fast, and I didn't have to create any accounts. Highly recommend!"
                  </p>
                </div>
                <div className="testimonial">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={getRandomAvatar(2)} alt="User Avatar" />
                    </div>
                    <div className="testimonial-user">
                      <h4>Michael Chen</h4>
                      <span className="testimonial-date">June 3, 2023</span>
                    </div>
                  </div>
                  <p className="testimonial-content">
                    "As a photographer, I need to share high-resolution images with clients quickly. TransferFiles has become my go-to solution - no file size limits and the end-to-end encryption gives me peace of mind for sensitive client work."
                  </p>
                </div>
                <div className="testimonial">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={getRandomAvatar(3)} alt="User Avatar" />
                    </div>
                    <div className="testimonial-user">
                      <h4>Emily Rodriguez</h4>
                      <span className="testimonial-date">July 22, 2023</span>
                    </div>
                  </div>
                  <p className="testimonial-content">
                    "I was skeptical about a browser-based file sharing tool, but TransferFiles proved me wrong. The connection was stable and fast. I transferred over 5GB of video files to my colleague without any issues."
                  </p>
                </div>
                <div className="testimonial">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={getRandomAvatar(4)} alt="User Avatar" />
                    </div>
                    <div className="testimonial-user">
                      <h4>David Kim</h4>
                      <span className="testimonial-date">August 9, 2023</span>
                    </div>
                  </div>
                  <p className="testimonial-content">
                    "The text messaging feature was an unexpected bonus. I use TransferFiles not just for sharing files but also for quickly sending code snippets to my team. The clean interface makes everything straightforward."
                  </p>
                </div>
                <div className="testimonial">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={getRandomAvatar(5)} alt="User Avatar" />
                    </div>
                    <div className="testimonial-user">
                      <h4>Lisa Thompson</h4>
                      <span className="testimonial-date">September 17, 2023</span>
                    </div>
                  </div>
                  <p className="testimonial-content">
                    "I work in a corporate environment with strict security policies. TransferFiles has been approved by our IT team since it doesn't store files on servers. It's been a game-changer for collaborating across departments."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Is TransferFiles safe to use?</h4>
              <p>Yes. TransferFiles uses end-to-end encryption via WebRTC, meaning your data is encrypted during transfer and only accessible to the connected devices. We don't store your files on any servers.</p>
            </div>
            <div className="faq-item">
              <h4>Do I need to create an account?</h4>
              <p>No. TransferFiles works instantly without registration, accounts, or personal information.</p>
            </div>
            <div className="faq-item">
              <h4>What's the maximum file size I can transfer?</h4>
              <p>There's no hard limit on file size. However, very large files may be affected by your browser's memory constraints and network conditions.</p>
            </div>
            <div className="faq-item">
              <h4>Can I transfer files between different operating systems?</h4>
              <p>Yes. TransferFiles works across all operating systems including Windows, macOS, Linux, iOS, and Android, as long as you're using a modern web browser.</p>
            </div>
            <div className="faq-item">
              <h4>How long does the connection stay active?</h4>
              <p>The connection remains active until either party closes their browser tab or clicks the disconnect button.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data stored anywhere?</h4>
              <p>No. Your files and messages are transferred directly between devices and are not stored on any servers.</p>
            </div>
            <div className="faq-item">
              <h4>Do both devices need to be online at the same time?</h4>
              <p>Yes. Since TransferFiles uses direct peer-to-peer connections, both devices must be online simultaneously for the transfer to complete.</p>
            </div>
            <div className="faq-item">
              <h4>Does TransferFiles work on mobile devices?</h4>
              <p>Yes. TransferFiles is fully responsive and works on smartphones and tablets using modern mobile browsers.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 