import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bounty, BountyCategory, BountyStatus, Submission } from '@/types';

interface BountyContextType {
  bounties: Bounty[];
  isLoading: boolean;
  fetchBounties: () => Promise<void>;
  getBountyById: (id: string) => Bounty | undefined;
  createBounty: (bounty: Omit<Bounty, 'id' | 'createdAt' | 'submissions'>) => Promise<string>;
  submitWork: (bountyId: string, submission: Omit<Submission, 'id' | 'submittedAt'>) => Promise<void>;
  approveBounty: (bountyId: string, submissionId: string) => Promise<void>;
  rejectBounty: (bountyId: string, submissionId: string) => Promise<void>;
}

const BountyContext = createContext<BountyContextType | undefined>(undefined);

const mockBounties: Bounty[] = [
  {
    id: '1',
    bountyMint: '9aXDJ8Q7qWxqBqGvdFH2Qr8v5RwVfYx3Lm7Tp4Hs2Kn1',
    vaultAddress: '7kY8Tc3RwNqGhDm5Vj9Xr2Pf6Ls4Bw8Qc1Hn9Zt5Vm3K',
    title: 'Design Modern Landing Page',
    description: 'Create a stunning landing page for a DeFi protocol with dark theme and modern animations.',
    category: BountyCategory.DESIGN,
    bountyAmount: 2.5,
    mintAddress: 'So11111111111111111111111111111111111111112',
    creatorAddress: '5Fg7Jk9Hn3Rq8Tc2Vw1Px4Lm6Ys9Zn7Bv3Qt8Wp5Km4',
    status: BountyStatus.OPEN,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    submissions: [],
  },
  {
    id: '2',
    bountyMint: '4Bw7Qc9Tn5Rm8Jx3Lp2Kv6Hy1Zn9Fg8Ws4Dt7Vm3Jk',
    vaultAddress: '8Hq2Rn7Lm4Vp9Tc6Yx3Bw1Zn5Fg8Ks2Jt9Wm4Qv7Hn',
    title: 'Smart Contract Development',
    description: 'Build and audit a Solana smart contract for NFT staking with reward distribution.',
    category: BountyCategory.DEVELOPMENT,
    bountyAmount: 5.0,
    mintAddress: 'So11111111111111111111111111111111111111112',
    creatorAddress: '3Tn9Km7Lw2Vp5Bx8Hy4Qc6Fn1Zr9Jt3Ws7Gm2Dx5Kp',
    status: BountyStatus.IN_PROGRESS,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submissions: [],
  },
  {
    id: '3',
    bountyMint: '6Vp2Hn9Km4Tc7Lx3Yw1Bq8Fn5Zr2Jt9Ws4Gm7Dx3Kp',
    vaultAddress: '2Jx5Tc9Rm7Wp4Lv6Hn3Bq1Yx8Fn2Ks9Zt4Gm7Dx5Vp',
    title: 'Content Writing Campaign',
    description: 'Write 10 high-quality blog posts about Web3 and blockchain technology.',
    category: BountyCategory.CONTENT,
    bountyAmount: 1.8,
    mintAddress: 'So11111111111111111111111111111111111111112',
    creatorAddress: '9Km4Tc7Lx3Yw1Bq8Fn5Zr2Jt9Ws4Gm7Dx3Kp6Vp2Hn',
    status: BountyStatus.OPEN,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    submissions: [],
  },
];

export function BountyProvider({ children }: { children: ReactNode }) {
  const [bounties, setBounties] = useState<Bounty[]>(mockBounties);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBounties = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBounties(mockBounties);
    } catch (error) {
      console.error('Error fetching bounties:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBountyById = (id: string): Bounty | undefined => {
    return bounties.find((b) => b.id === id);
  };

  const createBounty = async (
    bountyData: Omit<Bounty, 'id' | 'createdAt' | 'submissions'>
  ): Promise<string> => {
    try {
      const newBounty: Bounty = {
        ...bountyData,
        id: Date.now().toString(),
        createdAt: new Date(),
        submissions: [],
      };

      setBounties((prev) => [newBounty, ...prev]);
      return newBounty.id;
    } catch (error) {
      console.error('Error creating bounty:', error);
      throw error;
    }
  };

  const submitWork = async (
    bountyId: string,
    submissionData: Omit<Submission, 'id' | 'submittedAt'>
  ): Promise<void> => {
    try {
      const newSubmission: Submission = {
        ...submissionData,
        id: Date.now().toString(),
        submittedAt: new Date(),
      };

      setBounties((prev) =>
        prev.map((b) =>
          b.id === bountyId
            ? { ...b, submissions: [...b.submissions, newSubmission] }
            : b
        )
      );
    } catch (error) {
      console.error('Error submitting work:', error);
      throw error;
    }
  };

  const approveBounty = async (bountyId: string, submissionId: string): Promise<void> => {
    try {
      setBounties((prev) =>
        prev.map((b) => {
          if (b.id === bountyId) {
            return {
              ...b,
              status: BountyStatus.COMPLETED,
              submissions: b.submissions.map((s) =>
                s.id === submissionId ? { ...s, status: 'approved' as any } : s
              ),
            };
          }
          return b;
        })
      );
    } catch (error) {
      console.error('Error approving bounty:', error);
      throw error;
    }
  };

  const rejectBounty = async (bountyId: string, submissionId: string): Promise<void> => {
    try {
      setBounties((prev) =>
        prev.map((b) => {
          if (b.id === bountyId) {
            return {
              ...b,
              submissions: b.submissions.map((s) =>
                s.id === submissionId ? { ...s, status: 'rejected' as any } : s
              ),
            };
          }
          return b;
        })
      );
    } catch (error) {
      console.error('Error rejecting bounty:', error);
      throw error;
    }
  };

  return (
    <BountyContext.Provider
      value={{
        bounties,
        isLoading,
        fetchBounties,
        getBountyById,
        createBounty,
        submitWork,
        approveBounty,
        rejectBounty,
      }}
    >
      {children}
    </BountyContext.Provider>
  );
}

export function useBounty() {
  const context = useContext(BountyContext);
  if (context === undefined) {
    throw new Error('useBounty must be used within a BountyProvider');
  }
  return context;
}
