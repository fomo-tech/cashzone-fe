import React from "react";
import Avatar from "react-avatar";

interface UserAvatarProps {
  name?: string;
  src?: string;
  size?: string;
  round?: boolean;
  className?: string;
  textSizeRatio?: number;
  maxInitials?: number;
}

/**
 * Component Avatar người dùng sử dụng react-avatar
 * Tự động fallback sang initials nếu không có ảnh
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  src,
  size = "40",
  round = true,
  className = "",
  textSizeRatio = 2,
  maxInitials = 2,
}) => {
  return (
    <Avatar
      name={name || "User"}
      src={src}
      size={size}
      round={round}
      className={className}
      color="#f97316" // Orange-500
      fgColor="#ffffff"
      textSizeRatio={textSizeRatio}
      maxInitials={maxInitials}
    />
  );
};

export default UserAvatar;
