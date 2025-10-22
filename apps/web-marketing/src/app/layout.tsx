import type { Metadata } from 'next';
import { Provider } from '@/components/providers';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petra Online Coaching | Coaching Personalizzato',
  description:
    'Trasforma il tuo corpo con coaching online personalizzato. Programmi di allenamento su misura per donne e uomini.',
  keywords: ['coaching online', 'personal training', 'fitness', 'allenamento personalizzato'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <Navigation />
          {children}
        </Provider>
      </body>
    </html>
  );
}
