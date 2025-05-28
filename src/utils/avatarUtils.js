import defaultprofile from "/assets/icons/defaultprofile.png";

export function getAvatarUrl(entity, type = "user") {
  if (!entity) {
    return type === "group" ? "/assets/icons/group1.svg" : "/assets/icons/defaultprofile.png";
  }

  if (type === "group") {
    return entity.icon || "/assets/icons/group1.svg";
  }
  if (typeof entity === 'string' && entity.startsWith('/assets/icons/')) {
    return entity;  
  }
  
  if (entity.avatarUrl) {
    return entity.avatarUrl;
  }
  
  if (entity.avatar) {
    return entity.avatar;  
  }
  
  if (entity.profile && entity.profile.avatar) {
    return entity.profile.avatar;
  }
  
  if (entity.user && entity.user.avatarUrl) {
    return entity.user.avatarUrl;  
  }
  
  return "/assets/icons/defaultprofile.png";
}

export const getDisplayName = (entity, defaultName = "Unknown") => {
  if (!entity) return defaultName;

  return entity.name || entity.username || defaultName;
};

export const defaultProfileImage = defaultprofile;
