// app/layout.tsx
import type { Metadata } from 'next';
import '../styles/globals.css';
import Provider from '../provider/SessionProvider';
import ClientSessionHandler from '@/provider/ClientSideHandler';
import { CreatorProvider } from '@/provider/CreatorProvider';

export const metadata: Metadata = {
  title: 'Inzider',
  description: 'Inzide app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <CreatorProvider>
          <body>
            <ClientSessionHandler>{children}</ClientSessionHandler>
          </body>
        </CreatorProvider>
      </Provider>
    </html>
  );
}
