"use client";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TransferFiles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}