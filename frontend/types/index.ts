export interface User {
  id: string;
  username: string;
  email?: string;
  walletAddress: string;
  reputationScore: number;
  badges?: string[];
  createdAt: Date;
}

export interface Bounty {
  id: string;
  bountyMint: string;
  vaultAddress: string;
  title: string;
  description: string;
  category: BountyCategory;
  bountyAmount: number;
  mintAddress: string;
  creatorAddress: string;
  status: BountyStatus;
  deadline: Date;
  createdAt: Date;
  submissions: Submission[];
}

export enum BountyCategory {
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  MARKETING = 'marketing',
  CONTENT = 'content',
  OTHER = 'other',
}

export enum BountyStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export interface Submission {
  id: string;
  bountyId: string;
  hunterAddress: string;
  description: string;
  files: SubmissionFile[];
  status: SubmissionStatus;
  submittedAt: Date;
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
}

export interface SubmissionFile {
  uri: string;
  type: 'image' | 'document';
  name: string;
  size: number;
}

export interface WalletInfo {
  address: string;
  balance: number;
  tokens: TokenBalance[];
  connected: boolean;
  provider: WalletProvider;
}

export enum WalletProvider {
  PHANTOM = 'phantom',
  SOLFLARE = 'solflare',
  BACKPACK = 'backpack',
  LOCAL = 'local',
}

export interface TokenBalance {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
}

export interface CreateBountyFormData {
  title: string;
  description: string;
  category: BountyCategory;
  deadline: Date;
  bountyAmount: number;
  mintAddress: string;
}
