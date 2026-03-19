'use client';

import { useQuery } from '@tanstack/react-query';

export type DashboardPayload = {
  kpis: {
    totalAccounts: number;
    totalArr: number;
    avgHealth: number;
    atRiskAccounts: number;
    openActions: number;
    openRisks: number;
    pipelineTotal: number;
    weightedPipeline: number;
  };
  interactions: Array<{
    id: string;
    type: string | null;
    sentiment: string | null;
    summary: string | null;
    interaction_date: string | null;
    accounts: { name: string | null } | null;
  }>;
};

async function getDashboard(): Promise<DashboardPayload> {
  const response = await fetch('/api/dashboard', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load dashboard');
  }
  return response.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard
  });
}
