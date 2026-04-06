import type { Metadata } from 'next';
import '@/app/styles/globals.css';
import { Layout } from '@/app/components/Layout';
import { AuthProvider } from '@/app/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Field - Explore Your Career Path',
  description:
    'Discover potential careers through interactive, decision-based simulations. Step into different professional roles and explore your future.',
  keywords:
    'career exploration, students, career paths, simulations, high school',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/Favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
