'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTasks } from '@/lib/hooks/use-tasks';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function tone(priority: string | null) {
  const value = (priority ?? '').toLowerCase();
  if (value === 'high') return 'red' as const;
  if (value === 'medium') return 'yellow' as const;
  return 'slate' as const;
}

export default function TasksPage() {
  const { data, isLoading, isError } = useTasks();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from('action_items').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Action Items Board</h1>
        <p className="text-sm text-slate-600">Execution queue for open commitments across strategic accounts.</p>
      </div>

      <div className="space-y-3">
        {isLoading ? <p className="text-sm text-slate-500">Loading action items...</p> : null}
        {isError ? <p className="text-sm text-red-600">Failed to load action items.</p> : null}
        {(data ?? []).map((task) => (
          <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{task.description}</p>
              <div className="flex items-center gap-2">
                <Badge label={task.priority ?? 'n/a'} tone={tone(task.priority)} />
                <Badge label={task.status ?? 'open'} tone={task.status === 'done' ? 'green' : 'yellow'} />
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-600">Owner: {task.owner ?? 'N/A'}</p>
            <p className="text-xs text-slate-600">
              Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'N/A'}
            </p>
            <p className="text-xs text-slate-600">Account: {task.accounts?.name ?? 'Unknown'}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => mutation.mutate({ id: task.id, status: 'in_progress' })}>
                Mark In Progress
              </Button>
              <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => mutation.mutate({ id: task.id, status: 'done' })}>
                Mark Done
              </Button>
              {task.account_id ? (
                <Link href={`/accounts/${task.account_id}`} className="text-xs font-semibold text-brand-700 hover:text-brand-800">
                  Open Account
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
