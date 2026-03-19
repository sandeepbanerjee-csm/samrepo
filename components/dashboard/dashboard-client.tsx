'use client';

import { format } from 'date-fns';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import { formatCurrency } from '@/lib/utils';
import { KpiCard } from './kpi-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function toneFromSentiment(sentiment: string | null) {
  switch ((sentiment ?? '').toLowerCase()) {
    case 'positive':
      return 'green' as const;
    case 'negative':
      return 'red' as const;
    case 'neutral':
      return 'blue' as const;
    default:
      return 'slate' as const;
  }
}

export function DashboardClient() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">Failed to load dashboard insights.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-sm text-slate-600">Unified snapshot of portfolio health, risk exposure, and growth potential.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Accounts" value={String(data.kpis.totalAccounts)} />
        <KpiCard label="Portfolio ARR" value={formatCurrency(data.kpis.totalArr)} />
        <KpiCard label="Average Health" value={`${data.kpis.avgHealth}/100`} />
        <KpiCard label="At-Risk Accounts" value={String(data.kpis.atRiskAccounts)} />
        <KpiCard label="Open Action Items" value={String(data.kpis.openActions)} />
        <KpiCard label="Open Risks" value={String(data.kpis.openRisks)} />
        <KpiCard label="Pipeline Value" value={formatCurrency(data.kpis.pipelineTotal)} />
        <KpiCard label="Weighted Pipeline" value={formatCurrency(data.kpis.weightedPipeline)} />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Recent Client Interactions</h2>
        <div className="mt-4 space-y-3">
          {data.interactions.length === 0 ? (
            <p className="text-sm text-slate-500">No interactions captured yet.</p>
          ) : (
            data.interactions.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{item.accounts?.name ?? 'Unknown Account'}</p>
                  <Badge label={item.type ?? 'interaction'} tone="blue" />
                  <Badge label={item.sentiment ?? 'unknown'} tone={toneFromSentiment(item.sentiment)} />
                </div>
                <p className="mt-2 text-sm text-slate-700">{item.summary ?? 'No summary provided.'}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.interaction_date ? format(new Date(item.interaction_date), 'MMM d, yyyy p') : 'Date not set'}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
