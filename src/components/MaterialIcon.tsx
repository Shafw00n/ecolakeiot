import React from 'react';

interface MaterialIconProps {
  name: string;
  filled?: boolean;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  filled = false,
  size,
  className = '',
  style = {},
}) => {
  const customStyle: React.CSSProperties = { ...style };
  
  if (size) {
    customStyle.fontSize = typeof size === 'number' ? `${size}px` : size;
  }

  return (
    <span
      className={`material-symbols-rounded select-none flex-shrink-0 align-middle ${filled ? 'icon-filled' : ''} ${className}`}
      style={customStyle}
    >
      {name}
    </span>
  );
};

export default MaterialIcon;
