/**
 * Avatar utility functions for the transfer application
 */

// Default avatar configuration
const DEFAULT_AVATAR = '/avatars/Kodakku.png';

/**
 * Get the default avatar path
 */
export function getDefaultAvatar(): string {
  return DEFAULT_AVATAR;
}

/**
 * Get avatar for current user (sender)
 */
export function getCurrentUserAvatar(): string {
  return getDefaultAvatar();
}

/**
 * Get avatar for remote user (receiver)
 */
export function getRemoteUserAvatar(): string {
  return getDefaultAvatar();
}

/**
 * Future: Get random avatar from avatars directory
 * This will be implemented when more avatars are added
 */
export function getRandomAvatar(): string {
  // For now, return default avatar
  // In the future, this could randomly select from available avatars
  return getDefaultAvatar();
} 