import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import PWAInstaller from "@/components/PWAInstaller";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F9D71C'
};

export const metadata: Metadata = {
  title: "TransferFiles - Fast & Secure Cross-Device File Transfer",
  description: "Transfer files between any devices without installation. Secure, encrypted P2P sharing works across networks - Android, iPhone, PC, Mac all supported.",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TransferFiles'
  },
  applicationName: 'TransferFiles',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "TransferFiles - Fast & Secure Cross-Device File Transfer",
    description: "Transfer files between any devices without installation. Secure, encrypted P2P sharing works across networks - Android, iPhone, PC, Mac all supported.",
    url: "https://transferfiles.pro",
    siteName: "TransferFiles",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TransferFiles - Fast & Secure Cross-Device File Transfer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TransferFiles - Fast & Secure Cross-Device File Transfer",
    description: "Transfer files between any devices without installation. Secure, encrypted P2P sharing works across networks.",
    images: ["/twitter-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TransferFiles" />
        <meta name="msapplication-TileColor" content="#121214" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <Script 
          src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://app.pageview.app/js/script.js"
          data-domain="transferfiles.pro"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <div className="bg-decoration"></div>
        <PWAInstaller />
        <Header />
        {children}
        
        {/* Google Analytics */}
        <Script 
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
} 