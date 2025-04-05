"use client";

import { useState } from "react";
import Link from "next/link";

export default function Help() {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  
  // FAQ categories
  const categories = [
    { id: "general", name: "General" },
    { id: "connections", name: "Connection Issues" },
    { id: "transfers", name: "File Transfers" },
    { id: "compatibility", name: "Device Compatibility" },
    { id: "security", name: "Security & Privacy" },
    { id: "troubleshooting", name: "Troubleshooting" },
  ];
  
  // FAQ questions and answers grouped by category
  const faqs = {
    general: [
      {
        question: "What is TransferFiles?",
        answer: "TransferFiles is a browser-based peer-to-peer file sharing service that allows you to transfer files and text messages directly between devices without uploading them to a server. It uses WebRTC technology to establish a secure, direct connection between devices."
      },
      {
        question: "Do I need to create an account to use TransferFiles?",
        answer: "No, TransferFiles doesn't require any account creation or registration. Simply open the website and you can start transferring files immediately."
      },
      {
        question: "Is TransferFiles free to use?",
        answer: "Yes, TransferFiles is completely free for basic usage. There are no hidden fees or subscriptions required."
      },
      {
        question: "How does TransferFiles work?",
        answer: "TransferFiles uses WebRTC (Web Real-Time Communication) technology to establish a direct connection between two devices. When you open TransferFiles, it generates a unique ID for your session. When another device connects using this ID, a secure peer-to-peer connection is established, allowing direct transfer of files and messages without going through our servers."
      }
    ],
    connections: [
      {
        question: "Why can't I connect to another device?",
        answer: "Connection issues can be caused by various factors: 1) Make sure both devices have a working internet connection. 2) Check that you've entered the correct connection ID. 3) Ensure that both devices are using a compatible browser (Chrome, Firefox, Edge, or Safari). 4) Corporate firewalls or strict network settings might block WebRTC connections. 5) Try refreshing both browsers and generating a new connection ID."
      },
      {
        question: "Do both devices need to be on the same network?",
        answer: "No, TransferFiles works across different networks. You can connect devices that are on completely different networks and geographic locations."
      },
      {
        question: "How long does a connection stay active?",
        answer: "A connection remains active until either party closes their browser tab or clicks the disconnect button. There is no automatic timeout for active connections."
      },
      {
        question: "Can I connect more than two devices at once?",
        answer: "Currently, TransferFiles supports only one-to-one connections. You cannot connect multiple devices in a single session."
      }
    ],
    transfers: [
      {
        question: "Is there a file size limit?",
        answer: "TransferFiles doesn't impose a specific file size limit. However, practical limits exist based on your browser's memory constraints and network conditions. For extremely large files (multiple gigabytes), you might experience browser limitations."
      },
      {
        question: "What types of files can I transfer?",
        answer: "You can transfer any type of file, including documents, images, videos, audio files, archives, and executables. There are no restrictions on file formats."
      },
      {
        question: "Why is my file transfer slow?",
        answer: "Transfer speed depends primarily on the internet connection of both devices. If either device has a slow upload or download speed, the transfer will be limited by that connection. Other factors like network congestion and distance between devices can also affect speed."
      },
      {
        question: "Can I transfer multiple files at once?",
        answer: "Yes, you can select multiple files to transfer at the same time. They will be queued and transferred sequentially."
      },
      {
        question: "What happens if the connection drops during a transfer?",
        answer: "If the connection drops during a transfer, the transfer will fail. Unfortunately, there is no automatic resumption of interrupted transfers. You will need to reconnect and start the transfer again."
      }
    ],
    compatibility: [
      {
        question: "Which browsers are supported?",
        answer: "TransferFiles works on modern browsers that support WebRTC. This includes Google Chrome (version 80+), Mozilla Firefox (version 75+), Microsoft Edge (version 80+), Opera (version 67+), and Safari (version 13+)."
      },
      {
        question: "Does TransferFiles work on mobile devices?",
        answer: "Yes, TransferFiles works on mobile devices through their web browsers. The interface is responsive and adapts to smaller screens. For the best experience on mobile, we recommend using Chrome for Android or Safari for iOS."
      },
      {
        question: "Can I transfer files between different operating systems?",
        answer: "Yes, TransferFiles works across all operating systems including Windows, macOS, Linux, iOS, and Android. The only requirement is a supported web browser."
      },
      {
        question: "Why isn't TransferFiles working on my old browser?",
        answer: "TransferFiles relies on WebRTC technology, which is not supported in older browsers. If you're using an outdated browser version, you may need to update to the latest version or switch to a modern browser that supports WebRTC."
      }
    ],
    security: [
      {
        question: "Are my files secure during transfer?",
        answer: "Yes, all transfers are encrypted end-to-end using WebRTC's built-in encryption. No one, including the operators of TransferFiles, can access the content of your transfers."
      },
      {
        question: "Does TransferFiles store my files?",
        answer: "No, TransferFiles does not store your files on any servers. Files are transferred directly from one device to another without passing through our servers."
      },
      {
        question: "Can someone intercept my file transfers?",
        answer: "All transfers use encrypted connections, making interception extremely difficult. However, no system is 100% secure. For highly sensitive information, consider additional encryption methods for your files before transferring them."
      },
      {
        question: "How private are my transfers?",
        answer: "Your transfers are private between the connected devices. We do not log or monitor the content of transfers. Each connection ID is temporary and discarded after use."
      }
    ],
    troubleshooting: [
      {
        question: "The connection keeps failing, what can I do?",
        answer: "Try these steps: 1) Refresh both browsers. 2) Generate a new connection ID. 3) Check if any browser extensions might be interfering and temporarily disable them. 4) Try a different browser. 5) If on a corporate or school network, try using a personal network as some institutions block WebRTC connections."
      },
      {
        question: "Files aren't showing up after transfer, where are they?",
        answer: "Transferred files should appear in the 'Received Files' section. If they're not visible: 1) Check if the transfer completed successfully. 2) Try scrolling down in the received files section. 3) Refresh the browser and check if they appear. 4) If these steps don't work, there might have been an error during the transfer and you may need to try again."
      },
      {
        question: "My browser crashes when transferring large files",
        answer: "This is typically due to memory limitations in the browser. Try these solutions: 1) Close unnecessary tabs and applications to free up memory. 2) Transfer larger files in smaller chunks by splitting them into archives. 3) Try using a different browser with better memory management."
      },
      {
        question: "QR code scanning isn't working",
        answer: "If you're having trouble with QR code scanning: 1) Ensure your camera has permission to be used by the browser. 2) Make sure the QR code is well-lit and clearly visible. 3) Hold your device steady while scanning. 4) If scanning still fails, you can manually enter the connection ID instead."
      }
    ]
  };
  
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>Help Center</h1>
          
          <div className="help-intro">
            <p>
              Welcome to the TransferFiles Help Center. Find answers to common questions and troubleshooting 
              guides to help you make the most of our service.
            </p>
          </div>
          
          <div className="help-contact-banner">
            <p>
              Can't find what you're looking for? <Link href="/contact">Contact our support team</Link>
            </p>
          </div>
          
          <div className="help-content">
            <div className="help-sidebar">
              <h2>Categories</h2>
              <ul className="category-list">
                {categories.map(category => (
                  <li key={category.id}>
                    <button 
                      className={activeCategory === category.id ? "active" : ""}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="help-resources">
                <h3>Additional Resources</h3>
                <ul>
                  <li>
                    <Link href="/guide">User Guide</Link>
                  </li>
                  <li>
                    <Link href="/security">Security Information</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="faq-content">
              <h2>{categories.find(c => c.id === activeCategory)?.name} FAQ</h2>
              
              <div className="faq-list help-faq">
                {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                  <div className="faq-item" key={index}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="quick-help">
            <h2>Quick Help Guides</h2>
            <div className="help-guides">
              <div className="help-guide">
                <h3>Getting Started Guide</h3>
                <p>New to TransferFiles? Learn how to make your first connection and file transfer in minutes.</p>
                <Link href="/guide" className="btn-secondary">View Guide</Link>
              </div>
              
              <div className="help-guide">
                <h3>Connection Troubleshooting</h3>
                <p>Having trouble connecting? Follow our step-by-step troubleshooting guide.</p>
                <button 
                  className="btn-secondary"
                  onClick={() => setActiveCategory("troubleshooting")}
                >
                  View Solutions
                </button>
              </div>
              
              <div className="help-guide">
                <h3>Security Information</h3>
                <p>Learn about how TransferFiles keeps your data secure and private.</p>
                <Link href="/security" className="btn-secondary">View Security Details</Link>
              </div>
            </div>
          </div>
          
          <div className="page-links">
            <Link href="/" className="btn-back">Return to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
} 