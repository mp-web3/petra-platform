import type { Metadata } from 'next';
import { PetraUIProvider } from '@petra/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petra Online Coaching',
  description: 'Transform your fitness journey with personalized online coaching',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PetraUIProvider>{children}</PetraUIProvider>
      </body>
    </html>
  );
}

