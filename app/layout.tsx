import type { Metadata } from 'next';
import './styles/globals.css';
import Provider from './provider/SessionProvider';

export const metadata: Metadata = {
  title: 'Inzider',
  description: 'Inzide app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
