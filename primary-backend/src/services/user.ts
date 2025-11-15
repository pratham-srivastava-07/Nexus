import { prisma } from '../db';
import { UserCreate } from '../lib/zod';
import logger from '../lib/logger';

const log = logger.child('UserService');

export async function findUserById(id: string) {
  try {
    log.debug('Finding user by id', { id });
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    log.error('Error finding user by id', error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    log.debug('Finding user by email', { email });
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    log.error('Error finding user by email', error);
    throw error;
  }
}

export async function findUserByWallet(walletAddress: string) {
  try {
    log.debug('Finding user by wallet', { walletAddress });
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });
    return user;
  } catch (error) {
    log.error('Error finding user by wallet', error);
    throw error;
  }
}

export async function createUser(data: UserCreate) {
  try {
    log.debug('Creating user', { email: data.email, wallet: data.walletAddress });
    const user = await prisma.user.create({
      data: {
        email: data.email || null,
        walletAddress: data.walletAddress,
      },
    });
    log.info('User created successfully', { userId: user.id });
    return user;
  } catch (error) {
    log.error('Error creating user', error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<UserCreate>) {
  try {
    log.debug('Updating user', { id, data });
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email !== undefined ? data.email : undefined,
        walletAddress: data.walletAddress !== undefined ? data.walletAddress : undefined,
      },
    });
    log.info('User updated successfully', { userId: user.id });
    return user;
  } catch (error) {
    log.error('Error updating user', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    log.debug('Deleting user', { id });
    const user = await prisma.user.delete({
      where: { id },
    });
    log.info('User deleted successfully', { userId: user.id });
    return user;
  } catch (error) {
    log.error('Error deleting user', error);
    throw error;
  }
}

export async function getAllUsers(skip = 0, take = 10) {
  try {
    log.debug('Fetching users', { skip, take });
    const users = await prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return users;
  } catch (error) {
    log.error('Error fetching users', error);
    throw error;
  }
}

export async function getUserCount() {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    log.error('Error counting users', error);
    throw error;
  }
}
