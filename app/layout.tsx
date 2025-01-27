// app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';
import SessionProvider from '@/provider/SessionProvider';
import { CreatorProvider } from '@/provider/CreatorProvider';
import ClientSideHandler from '@/provider/ClientSideHandler';
import QueryProvider from '@/provider/QueryProvider';

export const metadata: Metadata = {
  title: 'Inzider',
  description: 'Travel like a local',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="font-satoshi h-full">
        <SessionProvider>
          <QueryProvider>
            <CreatorProvider>
              <ClientSideHandler>{children}</ClientSideHandler>
            </CreatorProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
