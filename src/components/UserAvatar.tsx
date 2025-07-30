import React from "react";

interface UserAvatarProps {
  src: string;
  alt: string;
  size?: number;
  circular?: boolean;
}
export default function UserAvatar({ src, alt, size = 48, circular = false }: UserAvatarProps) {
  return (
    <img 
      src={src}
      alt={alt}
      style={{ width: size, height: size}}
      className={circular ? "rounded-circle" : "rounded"}
    />
  );
}