"use client";

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
}

/**
 * 显示提示消息
 * @param message 消息内容
 * @param isError 是否为错误消息
 */
export function showToast(message: string, isError: boolean = false): void {
  // 检查是否已有toast元素，如果有则移除
  const existingToast = document.getElementById('toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 创建新的toast元素
  const toast = document.createElement('div');
  toast.id = 'toast-message';
  toast.className = isError ? 'toast error' : 'toast';
  toast.textContent = message;
  
  // 添加到body
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 2秒后自动隐藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);
} 