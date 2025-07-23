/**
 * 生成 8 位随机字符串作为 peer ID
 * 使用数字和小写字母，避免容易混淆的字符 (0, o, 1, l)
 */
export function generatePeerId(): string {
  const chars = '23456789abcdefghijkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 