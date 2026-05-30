import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookEase — Alex Carter Fitness',
  description: 'Book personal training sessions with Alex Carter. Transform your body, transform your life.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
