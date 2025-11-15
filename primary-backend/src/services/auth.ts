import { hashPassword, verifyPassword } from '../lib/crypto';
import { findUserByEmail, findUserByWallet, createUser } from './user';
import logger from '../lib/logger';
import { AuthSignup, AuthLogin } from '../lib/zod';

const log = logger.child('AuthService');

export async function signup(data: AuthSignup) {
  try {
    log.debug('Attempting signup', { email: data.email });

    // Check if user already exists
    const existingByEmail = data.email ? await findUserByEmail(data.email) : null;
    if (existingByEmail) {
      log.warn('Signup failed: email already exists', { email: data.email });
      throw new Error('Email already registered');
    }

    const existingByWallet = await findUserByWallet(data.walletAddress);
    if (existingByWallet) {
      log.warn('Signup failed: wallet already exists', { wallet: data.walletAddress });
      throw new Error('Wallet already registered');
    }

    // Create user
    const user = await createUser({
      email: data.email,
      walletAddress: data.walletAddress,
    });

    log.info('User signed up successfully', { userId: user.id, email: data.email });
    return user;
  } catch (error) {
    log.error('Signup error', error);
    throw error;
  }
}

export async function login(data: AuthLogin) {
  try {
    log.debug('Attempting login', { email: data.email });

    // Find user by email
    const user = await findUserByEmail(data.email);
    if (!user) {
      log.warn('Login failed: user not found', { email: data.email });
      throw new Error('User not found');
    }

    log.info('User logged in successfully', { userId: user.id, email: data.email });
    return user;
  } catch (error) {
    log.error('Login error', error);
    throw error;
  }
}

export async function verifyUserExists(email: string) {
  try {
    const user = await findUserByEmail(email);
    return !!user;
  } catch (error) {
    log.error('Error verifying user', error);
    return false;
  }
}
