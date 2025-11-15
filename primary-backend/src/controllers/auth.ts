import { Request, Response } from 'express';
import { signup as authSignup, login as authLogin } from '../services/auth';
import { AuthSignupSchema, AuthLoginSchema } from '../lib/zod';
import logger from '../lib/logger';

const log = logger.child('AuthController');

export async function signupController(req: Request, res: Response) {
  try {
    log.debug('Signup request', { body: req.body });

    // Validate input
    const validation = AuthSignupSchema.safeParse(req.body);
    if (!validation.success) {
      log.warn('Signup validation failed', { errors: validation.error.issues });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.issues,
      });
    }

    const user = await authSignup(validation.data);

    log.info('User signup successful', { userId: user.id });
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    log.error('Signup controller error', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    log.debug('Login request', { body: req.body });

    // Validate input
    const validation = AuthLoginSchema.safeParse(req.body);
    if (!validation.success) {
      log.warn('Login validation failed', { errors: validation.error.issues });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.issues,
      });
    }

    const user = await authLogin(validation.data);

    log.info('User login successful', { userId: user.id });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    log.error('Login controller error', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(401).json({
      success: false,
      message,
    });
  }
}

export async function meController(req: Request, res: Response) {
  try {
    // This would require authentication middleware to be implemented
    // For now, returning a placeholder response
    log.debug('Me request');
    return res.status(200).json({
      success: true,
      message: 'Authentication middleware not yet implemented',
    });
  } catch (error) {
    log.error('Me controller error', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
