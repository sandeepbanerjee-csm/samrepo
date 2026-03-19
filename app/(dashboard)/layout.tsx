import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-h-screen flex-1 p-6">{children}</main>
    </div>
  );
}
