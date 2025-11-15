import { z } from 'zod';

// User schemas
export const UserIdSchema = z.object({
  id: z.string().cuid('Invalid user ID'),
});

export const UserBaseSchema = z.object({
  email: z.string().email('Invalid email address').optional().nullable(),
  walletAddress: z.string().min(32, 'Invalid wallet address'),
});

export const UserCreateSchema = UserBaseSchema;

export const UserResponseSchema = UserBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserListSchema = z.array(UserResponseSchema);

// Auth schemas
export const AuthSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().min(32, 'Invalid wallet address'),
});

export const AuthLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const AuthResponseSchema = z.object({
  id: z.string(),
  email: z.string().email().optional().nullable(),
  walletAddress: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  message: z.string().optional(),
});

// Task schemas
export const TaskStatusSchema = z.enum(['OPEN', 'SUBMITTED', 'COMPLETED', 'DISPUTED', 'PAID', 'CANCELLED']);
export const SubmissionStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export const DisputeStatusSchema = z.enum(['OPEN', 'RESOLVED', 'REJECTED']);

export const TaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  deadline: z.date().optional(),
  bountyAmount: z.string().or(z.number()).optional(),
  bountyMint: z.string().optional(),
});

export const TaskUpdateSchema = TaskCreateSchema.partial();

export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional().nullable(),
  deadline: z.date().optional().nullable(),
  bountyAmount: z.string().optional(),
  bountyMint: z.string().optional(),
  vaultPda: z.string().optional().nullable(),
  createTx: z.string().optional().nullable(),
  status: TaskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  creatorId: z.string(),
});

// Submission schemas
export const SubmissionCreateSchema = z.object({
  taskId: z.string(),
  message: z.string().optional(),
  proofUrls: z.array(z.string()).optional(),
});

export const SubmissionUpdateSchema = z.object({
  status: SubmissionStatusSchema.optional(),
  message: z.string().optional(),
});

export const SubmissionResponseSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  userId: z.string(),
  message: z.string().optional().nullable(),
  proofUrls: z.array(z.string()),
  status: SubmissionStatusSchema,
  submittedAt: z.date(),
  decisionAt: z.date().optional().nullable(),
});

// Dispute schemas
export const DisputeCreateSchema = z.object({
  taskId: z.string(),
  reason: z.string().min(1, 'Reason is required'),
});

export const DisputeResponseSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  raisedById: z.string(),
  reason: z.string(),
  status: DisputeStatusSchema,
  createdAt: z.date(),
  resolvedAt: z.date().optional().nullable(),
});

// Type exports for convenience
export type User = z.infer<typeof UserResponseSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type AuthSignup = z.infer<typeof AuthSignupSchema>;
export type AuthLogin = z.infer<typeof AuthLoginSchema>;
export type Task = z.infer<typeof TaskResponseSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type Submission = z.infer<typeof SubmissionResponseSchema>;
export type Dispute = z.infer<typeof DisputeResponseSchema>;
