import { AccountDetailClient } from '@/components/accounts/account-detail-client';

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  return <AccountDetailClient accountId={params.id} />;
}
