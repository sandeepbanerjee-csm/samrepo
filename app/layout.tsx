import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/shared/providers';

export const metadata: Metadata = {
  title: 'Customer Success Command Center',
  description: 'Strategic account command center for IT services customer success teams.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
