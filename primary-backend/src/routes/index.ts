import express from 'express';
import { signupController, loginController, meController } from '../controllers';

export const authRouter = express.Router();

// Auth endpoints
authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.get('/me', meController);

export const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount auth router
apiRouter.use('/auth', authRouter);

