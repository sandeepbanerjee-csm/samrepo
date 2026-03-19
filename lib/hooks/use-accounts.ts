'use client';

import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/types/database';

async function getAccounts(search: string, tier: string): Promise<Tables<'accounts'>[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (tier) params.set('tier', tier);

  const response = await fetch(`/api/accounts?${params.toString()}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to load accounts');
  }

  return response.json();
}

export function useAccounts(search: string, tier: string) {
  return useQuery({
    queryKey: ['accounts', search, tier],
    queryFn: () => getAccounts(search, tier)
  });
}
