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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon.svg',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="font-satoshi h-full flex flex-col">
        <SessionProvider>
          <QueryProvider>
            <CreatorProvider>
              <ClientSideHandler>
                <main className="flex-grow">{children}</main>
              </ClientSideHandler>
            </CreatorProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
