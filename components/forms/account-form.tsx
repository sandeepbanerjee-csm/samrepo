'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const tiers = ['strategic', 'enterprise', 'growth'];

export function AccountForm() {
  const router = useRouter();
  const [techStackInput, setTechStackInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stackArray = useMemo(
    () =>
      techStackInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [techStackInput]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get('name') ?? ''),
      industry: String(formData.get('industry') ?? ''),
      account_tier: String(formData.get('account_tier') ?? ''),
      arr: Number(formData.get('arr') ?? 0),
      start_date: String(formData.get('start_date') ?? ''),
      renewal_date: String(formData.get('renewal_date') ?? ''),
      engagement_model: String(formData.get('engagement_model') ?? ''),
      delivery_manager: String(formData.get('delivery_manager') ?? ''),
      tech_stack: stackArray
    };

    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unable to create account' }));
      setError(data.error ?? 'Unable to create account');
      setLoading(false);
      return;
    }

    router.push('/accounts');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Account Name</label>
        <Input name="name" required placeholder="Acme Corp" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Industry</label>
        <Input name="industry" placeholder="Financial Services" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tier</label>
        <Select name="account_tier" defaultValue="strategic">
          {tiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">ARR</label>
        <Input name="arr" type="number" min={0} placeholder="1200000" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Engagement Model</label>
        <Input name="engagement_model" placeholder="Managed Services" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
        <Input name="start_date" type="date" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Renewal Date</label>
        <Input name="renewal_date" type="date" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Manager</label>
        <Input name="delivery_manager" placeholder="Alicia Kim" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Tech Stack (comma separated)</label>
        <Input
          name="tech_stack"
          value={techStackInput}
          onChange={(event) => setTechStackInput(event.target.value)}
          placeholder="AWS, Terraform, Node.js"
        />
      </div>
      {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
