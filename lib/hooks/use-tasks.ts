'use client';

import { useQuery } from '@tanstack/react-query';

type TaskRow = {
  id: string;
  description: string | null;
  owner: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  account_id: string | null;
  accounts: { name: string | null } | null;
};

async function getTasks(): Promise<TaskRow[]> {
  const response = await fetch('/api/tasks', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to load action items');
  }

  return response.json();
}

export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: getTasks });
}
