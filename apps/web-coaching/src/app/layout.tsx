import type { Metadata } from 'next';
import { PetraUIProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petra Coaching Platform',
  description: 'Your personalized online coaching experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PetraUIProvider>
          <AuthProvider>{children}</AuthProvider>
        </PetraUIProvider>
      </body>
    </html>
  );
}

