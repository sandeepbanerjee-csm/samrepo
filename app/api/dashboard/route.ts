import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const [
    { count: totalAccounts },
    { data: arrRows },
    { count: openActions },
    { count: openRisks },
    { data: healthRows },
    { data: pipelineRows },
    { data: interactions }
  ] = await Promise.all([
    supabase.from('accounts').select('*', { count: 'exact', head: true }),
    supabase.from('accounts').select('arr'),
    supabase.from('action_items').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('risks').select('*', { count: 'exact', head: true }).in('status', ['open', 'active']),
    supabase.from('health_scores').select('score, status'),
    supabase.from('opportunities').select('value, probability'),
    supabase
      .from('interactions')
      .select('id, type, sentiment, summary, interaction_date, account_id, accounts(name)')
      .order('interaction_date', { ascending: false })
      .limit(6)
  ]);

  const totalArr = (arrRows ?? []).reduce((sum, row) => sum + Number(row.arr ?? 0), 0);

  const avgHealth =
    (healthRows ?? []).length > 0
      ? Math.round((healthRows ?? []).reduce((sum, row) => sum + Number(row.score ?? 0), 0) / (healthRows ?? []).length)
      : 0;

  const atRiskAccounts = (healthRows ?? []).filter((row) =>
    ['red', 'at_risk', 'critical'].includes((row.status ?? '').toLowerCase())
  ).length;

  const pipelineTotal = (pipelineRows ?? []).reduce((sum, row) => sum + Number(row.value ?? 0), 0);
  const weightedPipeline = (pipelineRows ?? []).reduce(
    (sum, row) => sum + Number(row.value ?? 0) * (Number(row.probability ?? 0) / 100),
    0
  );

  return NextResponse.json({
    kpis: {
      totalAccounts: totalAccounts ?? 0,
      totalArr,
      avgHealth,
      atRiskAccounts,
      openActions: openActions ?? 0,
      openRisks: openRisks ?? 0,
      pipelineTotal,
      weightedPipeline
    },
    interactions: interactions ?? []
  });
}
