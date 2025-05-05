import { Context } from 'hono';
import prisma from '../config/prisma.config';

export class PaymentController {
  static async createPayment(c: Context) {
    try {
      const groupId = parseInt(c.req.param('groupId'));
      const { userId, amount, note } = await c.req.json();
      const currentUser = c.get('user');
      
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const member = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: userId || currentUser.id,
            groupId
          }
        }
      });
      
      if (!member) {
        return c.json({ message: 'User is not a member of this group' }, 400);
      }
      
      const payment = await prisma.payment.create({
        data: {
          groupId,
          userId: userId || currentUser.id,
          amount,
          note
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      });
      
      // decrease what they owe since they just paid some
      await prisma.groupMember.update({
        where: {
          userId_groupId: {
            userId: userId || currentUser.id,
            groupId
          }
        },
        data: {
          amountOwed: {
            decrement: amount
          }
        }
      });
      
      return c.json(payment, 201);
    } catch (error) {
      console.error('Create payment error:', error);
      return c.json({ message: 'Server error while creating payment' }, 500);
    }
  }
  
  static async getGroupPayments(c: Context) {
    try {
      const groupId = parseInt(c.req.param('groupId'));
      
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) {
        return c.json({ message: 'Group not found' }, 404);
      }
      
      const payments = await prisma.payment.findMany({
        where: { groupId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return c.json(payments);
    } catch (error) {
      console.error('Get group payments error:', error);
      return c.json({ message: 'Server error while fetching group payments' }, 500);
    }
  }
}