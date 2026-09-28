import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/ui/Toast';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Стоп-лист · Coperto',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-canvas text-ink antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
