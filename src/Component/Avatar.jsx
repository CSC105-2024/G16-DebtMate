const Avatar = ({ src, alt, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", // Matches your card height
    lg: "w-12 h-12",
  };

  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  );
};

export default Avatar;
