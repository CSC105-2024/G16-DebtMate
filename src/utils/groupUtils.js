import axios from 'axios';

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

export const updateGroupTotal = async (groupId, total) => {
  try {
    const response = await axios.put(
      `/api/groups/${groupId}/total`,
      { total },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Error updating group total:', err);
    throw err;
  }
};

export const calculateGroupTotal = async (groupId) => {
  try {
    const response = await axios.get(`/api/groups/${groupId}`, {
      withCredentials: true,
    });
    
    const group = response.data;
    if (!group) throw new Error("Group not found");
    
    const ownerId = group.ownerId || (group.owner && group.owner.id);
    
    let total = 0;
    const memberAmounts = {};
    
    if (group.members && group.items) {
      const memberTotals = {};
      let subtotal = 0;
      
      group.members.forEach((member) => {
        const memberId = member.userId || (member.user ? member.user.id : member.id);
        if (memberId !== ownerId) {
          memberTotals[memberId] = 0;
        }
      });
      
      // Calculate base item amounts
      group.items.forEach((item) => {
        const itemAmount = parseFloat(item.amount);
        let splitMembers;
        
        if (item.users && item.users.length > 0) {
          splitMembers = item.users.map((u) => u.userId || u.user?.id);
        } else if (item.splitBetween && item.splitBetween.length > 0) {
          splitMembers = item.splitBetween;
        } else {
          splitMembers = group.members.map((m) => m.userId || m.user?.id || m.id);
        }
        
        if (splitMembers && splitMembers.length > 0) {
          const splitAmount = itemAmount / splitMembers.length;
          
          splitMembers.forEach((memberId) => {
            if (memberId !== ownerId) {
              memberTotals[memberId] = (memberTotals[memberId] || 0) + splitAmount;
            }
          });
          
          subtotal += itemAmount;
        }
      });
      
      // Apply service charge and tax proportionally
      const serviceChargeRate = parseFloat(group.serviceCharge || 0) / 100;
      const taxRate = parseFloat(group.tax || 0) / 100;
      const extraAmount = subtotal * (serviceChargeRate + taxRate);
      
      // Calculate final amounts for each member including tax and service charge
      Object.keys(memberTotals).forEach((memberId) => {
        if (subtotal > 0) {
          const proportion = memberTotals[memberId] / subtotal;
          const memberExtra = extraAmount * proportion;
          memberTotals[memberId] += memberExtra;
          
          // Round to 2 decimal places
          memberTotals[memberId] = parseFloat(memberTotals[memberId].toFixed(2));
        }
        
        memberAmounts[memberId] = memberTotals[memberId];
        
        const member = group.members.find(m => {
          const mId = m.userId || (m.user && m.user.id);
          return mId == memberId;
        });
        
        if (member && !member.isPaid) {
          total += memberTotals[memberId];
        }
      });
    }
    
    total = parseFloat(total.toFixed(2));
    
    await updateGroupTotal(groupId, total);
    
    // Update each member's amountOwed in the database
    const updatePromises = Object.entries(memberAmounts).map(([memberId, amount]) => {
      return updateMemberAmount(groupId, parseInt(memberId), amount);
    });
    
    await Promise.all(updatePromises);
    
    return total;
  } catch (err) {
    console.error('Error calculating group total:', err);
    throw err;
  }
};

export const updateMemberAmount = async (groupId, memberId, amount) => {
  try {
    await axios.put(
      `/api/groups/${groupId}/members/${memberId}/amount`,
      { amountOwed: amount },
      { withCredentials: true }
    );
  } catch (err) {
    console.error(`Error updating amount for member ${memberId}:`, err);
  }
};
