"use client";

/**
 * Format file size
 * @param bytes File size in bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
}

/**
 * Show toast message
 * @param message Message content
 * @param isError Whether it's an error message
 */
export function showToast(message: string, isError: boolean = false): void {
  // Check if a toast element already exists and remove it
  const existingToast = document.getElementById('toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast element
  const toast = document.createElement('div');
  toast.id = 'toast-message';
  toast.className = isError ? 'toast error' : 'toast';
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Show animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hide automatically after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
} 