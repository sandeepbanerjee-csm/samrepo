import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().optional().nullable(),
  account_tier: z.string().optional().nullable(),
  arr: z.coerce.number().optional().nullable(),
  start_date: z.string().optional().nullable(),
  renewal_date: z.string().optional().nullable(),
  engagement_model: z.string().optional().nullable(),
  delivery_manager: z.string().optional().nullable(),
  tech_stack: z.array(z.string()).optional().nullable()
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const accountId = params.id;

  const [accountRes, contactsRes, interactionsRes, actionsRes, healthRes, risksRes, opportunitiesRes] =
    await Promise.all([
      supabase.from('accounts').select('*').eq('id', accountId).single(),
      supabase.from('contacts').select('*').eq('account_id', accountId).order('created_at', { ascending: false }),
      supabase
        .from('interactions')
        .select('*')
        .eq('account_id', accountId)
        .order('interaction_date', { ascending: false }),
      supabase.from('action_items').select('*').eq('account_id', accountId).order('due_date', { ascending: true }),
      supabase
        .from('health_scores')
        .select('*')
        .eq('account_id', accountId)
        .order('calculated_at', { ascending: false }),
      supabase.from('risks').select('*').eq('account_id', accountId).order('created_at', { ascending: false }),
      supabase
        .from('opportunities')
        .select('*')
        .eq('account_id', accountId)
        .order('expected_close_date', { ascending: true })
    ]);

  if (accountRes.error || !accountRes.data) {
    return NextResponse.json({ error: accountRes.error?.message ?? 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({
    account: accountRes.data,
    contacts: contactsRes.data ?? [],
    interactions: interactionsRes.data ?? [],
    action_items: actionsRes.data ?? [],
    health_scores: healthRes.data ?? [],
    risks: risksRes.data ?? [],
    opportunities: opportunitiesRes.data ?? []
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const parsed = updateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts')
    .update(parsed.data)
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { error } = await supabase.from('accounts').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
