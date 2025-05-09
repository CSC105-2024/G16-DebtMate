import defaultprofile from "/assets/icons/defaultprofile.png";

export const getAvatarUrl = (entity, type = "user") => {
  if (!entity) return defaultprofile;

  if (type === "group") {
    return entity.icon || entity.avatarUrl || defaultprofile;
  }

  return entity.avatarUrl || defaultprofile;
};

export const getDisplayName = (entity, defaultName = "Unknown") => {
  if (!entity) return defaultName;

  return entity.name || entity.username || defaultName;
};

export const defaultProfileImage = defaultprofile;
