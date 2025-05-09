export const filterRemainingUsers = (itemUsers, options = {}) => {
  if (!Array.isArray(itemUsers)) return [];

  const { removedMembers, removedMemberId, validMemberIds } = options;

  return itemUsers.filter((assignment) => {
    const userId = assignment.userId || (assignment.user && assignment.user.id);

    if (Array.isArray(removedMembers)) {
      return !removedMembers.some(
        (removedMember) => userId === removedMember.id
      );
    }

    if (removedMemberId !== undefined && Array.isArray(validMemberIds)) {
      return userId !== removedMemberId && validMemberIds.includes(userId);
    }

    if (removedMemberId !== undefined) {
      return userId !== removedMemberId;
    }

    return true;
  });
};
