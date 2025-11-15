import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter, authRouter } from './routes';
import logger from './lib/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const log = logger.child('Server');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  log.debug(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1', apiRouter);
app.use("/auth/v1", authRouter);

// 404 handler
app.use((req, res) => {
  log.warn('404 Not Found', { path: req.path, method: req.method });
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log.error('Unhandled error', { error: err.message });
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  log.info(`Server started on port ${PORT}`, { NODE_ENV });
});

export default app;
