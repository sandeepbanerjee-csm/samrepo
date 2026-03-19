'use client';

import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/types/database';

export type AccountDetail = {
  account: Tables<'accounts'>;
  contacts: Tables<'contacts'>[];
  interactions: Tables<'interactions'>[];
  action_items: Tables<'action_items'>[];
  health_scores: Tables<'health_scores'>[];
  risks: Tables<'risks'>[];
  opportunities: Tables<'opportunities'>[];
};

async function getAccountDetail(id: string): Promise<AccountDetail> {
  const response = await fetch(`/api/accounts/${id}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to load account detail');
  }

  return response.json();
}

export function useAccountDetail(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccountDetail(id)
  });
}
