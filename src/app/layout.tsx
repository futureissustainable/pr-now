import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'PR Now — AI-Powered Media Outreach',
  description: 'Automate your PR outreach with AI. Discover outlets, draft pitches, and manage campaigns from a single dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
