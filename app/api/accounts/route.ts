import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const createAccountSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  account_tier: z.string().optional(),
  arr: z.coerce.number().optional(),
  start_date: z.string().optional(),
  renewal_date: z.string().optional(),
  engagement_model: z.string().optional(),
  delivery_manager: z.string().optional(),
  tech_stack: z.array(z.string()).optional()
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') ?? '';
  const tier = searchParams.get('tier') ?? 'all';

  let query = supabase.from('accounts').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (tier !== 'all') {
    query = query.eq('account_tier', tier);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createAccountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      ...parsed.data,
      tech_stack: parsed.data.tech_stack ?? []
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
