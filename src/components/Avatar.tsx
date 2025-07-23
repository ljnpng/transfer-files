import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'User Avatar', 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium', 
    large: 'avatar-large'
  };

  return (
    <div className={`avatar ${sizeClasses[size]} ${className}`}>
      <img 
        src={src} 
        alt={alt}
        onError={(e) => {
          // Fallback to default avatar if image fails to load
          const target = e.target as HTMLImageElement;
          target.src = '/avatars/Kodakku.png';
        }}
      />
    </div>
  );
};

export default Avatar; 