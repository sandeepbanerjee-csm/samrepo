'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAccountDetail } from '@/lib/hooks/use-account-detail';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

function statusTone(status: string | null) {
  const normalized = (status ?? '').toLowerCase();
  if (['open', 'active'].includes(normalized)) return 'yellow' as const;
  if (['closed', 'resolved', 'done'].includes(normalized)) return 'green' as const;
  if (['blocked', 'critical', 'red', 'at_risk'].includes(normalized)) return 'red' as const;
  return 'slate' as const;
}

export function AccountDetailClient({ accountId }: { accountId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAccountDetail(accountId);
  const [techStack, setTechStack] = useState('');

  const latestHealth = useMemo(() => data?.health_scores?.[0], [data?.health_scores]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['account', accountId] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      router.push('/accounts');
      router.refresh();
    }
  });

  async function handleEntityCreate(event: FormEvent<HTMLFormElement>, table: string) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const supabase = createClient();

    const payload = Object.fromEntries(formData.entries());
    const normalized: Record<string, unknown> = {
      ...payload,
      account_id: accountId
    };

    if ('influence_score' in normalized) normalized.influence_score = Number(normalized.influence_score || 0);
    if ('score' in normalized) normalized.score = Number(normalized.score || 0);
    if ('value' in normalized) normalized.value = Number(normalized.value || 0);
    if ('probability' in normalized) normalized.probability = Number(normalized.probability || 0);

    const { error } = await supabase.from(table as never).insert(normalized as never);

    if (!error) {
      form.reset();
      await refresh();
    }
  }

  async function updateActionStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase.from('action_items').update({ status }).eq('id', id);
    if (!error) {
      await refresh();
    }
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading account details...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">Failed to load account detail.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{data.account.name}</h1>
          <p className="text-sm text-slate-600">
            {data.account.industry ?? 'Unknown Industry'} · {data.account.engagement_model ?? 'Engagement model not set'}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            ARR: {formatCurrency(data.account.arr)} · Renewal:{' '}
            {data.account.renewal_date ? format(new Date(data.account.renewal_date), 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={data.account.account_tier ?? 'tier n/a'} tone="blue" />
          {latestHealth ? <Badge label={`Health: ${latestHealth.score ?? 0}`} tone={statusTone(latestHealth.status)} /> : null}
          <Button variant="danger" onClick={() => deleteAccount.mutate()}>
            Delete Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Update Account Profile</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const payload = {
                name: String(formData.get('name') ?? data.account.name),
                industry: String(formData.get('industry') ?? ''),
                account_tier: String(formData.get('account_tier') ?? ''),
                arr: Number(formData.get('arr') ?? 0),
                delivery_manager: String(formData.get('delivery_manager') ?? ''),
                engagement_model: String(formData.get('engagement_model') ?? ''),
                start_date: String(formData.get('start_date') ?? ''),
                renewal_date: String(formData.get('renewal_date') ?? ''),
                tech_stack: techStack
                  ? techStack
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : data.account.tech_stack ?? []
              };

              await fetch(`/api/accounts/${accountId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              await refresh();
            }}
          >
            <Input name="name" defaultValue={data.account.name} placeholder="Account Name" />
            <Input name="industry" defaultValue={data.account.industry ?? ''} placeholder="Industry" />
            <Select name="account_tier" defaultValue={data.account.account_tier ?? 'strategic'}>
              <option value="strategic">strategic</option>
              <option value="enterprise">enterprise</option>
              <option value="growth">growth</option>
            </Select>
            <Input name="arr" type="number" defaultValue={data.account.arr ?? 0} />
            <Input name="delivery_manager" defaultValue={data.account.delivery_manager ?? ''} placeholder="Delivery Manager" />
            <Input name="engagement_model" defaultValue={data.account.engagement_model ?? ''} placeholder="Engagement Model" />
            <div className="grid grid-cols-2 gap-2">
              <Input name="start_date" type="date" defaultValue={data.account.start_date ?? ''} />
              <Input name="renewal_date" type="date" defaultValue={data.account.renewal_date ?? ''} />
            </div>
            <Input
              value={techStack}
              onChange={(event) => setTechStack(event.target.value)}
              placeholder={(data.account.tech_stack ?? []).join(', ') || 'Tech stack (comma separated)'}
            />
            <Button type="submit">Save Profile</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Action Items</h2>
          <form className="mt-4 grid gap-2" onSubmit={(event) => handleEntityCreate(event, 'action_items')}>
            <Input name="description" placeholder="Action description" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="owner" placeholder="Owner" required />
              <Input name="due_date" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select name="priority" defaultValue="medium">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </Select>
              <Select name="status" defaultValue="open">
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </Select>
            </div>
            <Button type="submit">Add Action</Button>
          </form>
          <div className="mt-4 space-y-2">
            {data.action_items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{item.description}</p>
                  <Badge label={item.status ?? 'open'} tone={statusTone(item.status)} />
                </div>
                <p className="text-xs text-slate-500">Owner: {item.owner ?? 'N/A'} · Due: {item.due_date ?? 'N/A'}</p>
                <div className="mt-2 flex gap-2">
                  <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => updateActionStatus(item.id, 'in_progress')}>
                    In Progress
                  </Button>
                  <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => updateActionStatus(item.id, 'done')}>
                    Done
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
          <form className="mt-4 grid gap-2" onSubmit={(event) => handleEntityCreate(event, 'contacts')}>
            <Input name="name" placeholder="Name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="role" placeholder="Role" />
              <Input name="sentiment" placeholder="sentiment" />
            </div>
            <Input name="influence_score" type="number" placeholder="Influence score 1-10" />
            <Button type="submit">Add Contact</Button>
          </form>
          <div className="mt-4 space-y-2">
            {data.contacts.map((contact) => (
              <div key={contact.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <p className="font-medium text-slate-900">{contact.name}</p>
                <p className="text-slate-600">{contact.role ?? 'N/A'} · {contact.email ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Interactions</h2>
          <form className="mt-4 grid gap-2" onSubmit={(event) => handleEntityCreate(event, 'interactions')}>
            <div className="grid grid-cols-2 gap-2">
              <Input name="type" placeholder="QBR / Call / Escalation" required />
              <Input name="interaction_date" type="datetime-local" required />
            </div>
            <Input name="sentiment" placeholder="positive / neutral / negative" />
            <Textarea name="summary" placeholder="Summary of interaction" required />
            <Button type="submit">Log Interaction</Button>
          </form>
          <div className="mt-4 space-y-2">
            {data.interactions.map((interaction) => (
              <div key={interaction.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge label={interaction.type ?? 'interaction'} tone="blue" />
                  <Badge label={interaction.sentiment ?? 'unknown'} tone={statusTone(interaction.sentiment)} />
                </div>
                <p className="mt-1 text-slate-700">{interaction.summary}</p>
                <p className="text-xs text-slate-500">{interaction.interaction_date ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Risks</h2>
          <form className="mt-4 grid gap-2" onSubmit={(event) => handleEntityCreate(event, 'risks')}>
            <Input name="type" placeholder="Delivery / Commercial / Relationship" required />
            <Textarea name="description" placeholder="Risk description" required />
            <Textarea name="mitigation" placeholder="Mitigation plan" />
            <Select name="status" defaultValue="open">
              <option value="open">open</option>
              <option value="active">active</option>
              <option value="resolved">resolved</option>
            </Select>
            <Button type="submit">Add Risk</Button>
          </form>
          <div className="mt-4 space-y-2">
            {data.risks.map((risk) => (
              <div key={risk.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge label={risk.type ?? 'risk'} tone="red" />
                  <Badge label={risk.status ?? 'open'} tone={statusTone(risk.status)} />
                </div>
                <p className="mt-1 text-slate-700">{risk.description}</p>
                <p className="text-xs text-slate-500">Mitigation: {risk.mitigation ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Opportunities & Health</h2>
          <form className="mt-4 grid gap-2" onSubmit={(event) => handleEntityCreate(event, 'opportunities')}>
            <Input name="title" placeholder="Opportunity title" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="value" type="number" placeholder="Value" required />
              <Input name="probability" type="number" min={0} max={100} placeholder="Probability %" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input name="stage" placeholder="Stage" required />
              <Input name="expected_close_date" type="date" required />
            </div>
            <Button type="submit">Add Opportunity</Button>
          </form>

          <form className="mt-4 grid gap-2 border-t border-slate-200 pt-4" onSubmit={(event) => handleEntityCreate(event, 'health_scores')}>
            <div className="grid grid-cols-2 gap-2">
              <Input name="score" type="number" min={0} max={100} placeholder="Health score" required />
              <Input name="status" placeholder="green / yellow / red" required />
            </div>
            <Button type="submit" variant="secondary">Record Health Score</Button>
          </form>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Opportunities</h3>
            {data.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <p className="font-medium text-slate-900">{opportunity.title}</p>
                <p className="text-slate-700">
                  {formatCurrency(opportunity.value)} · {opportunity.probability}% · {opportunity.stage}
                </p>
                <p className="text-xs text-slate-500">Expected Close: {opportunity.expected_close_date ?? 'N/A'}</p>
              </div>
            ))}

            <h3 className="pt-2 text-sm font-semibold text-slate-700">Health History</h3>
            {data.health_scores.map((health) => (
              <div key={health.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge label={`Score: ${health.score ?? 0}`} tone={statusTone(health.status)} />
                  <Badge label={health.status ?? 'unknown'} tone={statusTone(health.status)} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {health.calculated_at ? format(new Date(health.calculated_at), 'MMM d, yyyy p') : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
