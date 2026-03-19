-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  role text default 'csm',
  created_at timestamp default now()
);

-- ACCOUNTS
create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  account_tier text,
  arr numeric,
  start_date date,
  renewal_date date,
  engagement_model text,
  delivery_manager text,
  tech_stack text[],
  created_at timestamp default now()
);

-- CONTACTS
create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  name text,
  email text,
  role text,
  sentiment text,
  influence_score int,
  created_at timestamp default now()
);

-- INTERACTIONS
create table interactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  type text,
  summary text,
  sentiment text,
  interaction_date timestamp,
  created_at timestamp default now()
);

-- ACTION ITEMS
create table action_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  interaction_id uuid references interactions(id) on delete set null,
  description text,
  owner text,
  due_date date,
  priority text,
  status text default 'open',
  created_at timestamp default now()
);

-- HEALTH SCORES
create table health_scores (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  score int,
  status text,
  calculated_at timestamp default now()
);

-- RISKS
create table risks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  type text,
  description text,
  mitigation text,
  status text,
  created_at timestamp default now()
);

-- OPPORTUNITIES
create table opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  title text,
  value numeric,
  probability int,
  stage text,
  expected_close_date date,
  created_at timestamp default now()
);
