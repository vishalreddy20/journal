import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlens.vercel.app'),
  title: 'SpendLens — AI Spend Audit for Startups',
  description:
    'Find where your AI budget is leaking. Free 2-minute audit for engineering teams. No signup required. See your savings instantly.',
  keywords: [
    'AI cost optimization',
    'Cursor pricing',
    'GitHub Copilot cost',
    'Claude vs ChatGPT price',
    'AI tools audit',
    'startup AI budget',
    'reduce AI spend',
  ],
  authors: [{ name: 'Credex', url: 'https://credex.rocks' }],
  openGraph: {
    title: 'SpendLens — AI Spend Audit for Startups',
    description:
      'Free 2-minute audit. Find where your AI budget is leaking. See your savings instantly.',
    type: 'website',
    url: 'https://spendlens.vercel.app',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SpendLens AI Spend Audit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — AI Spend Audit for Startups',
    description: 'Free 2-minute audit. Find where your AI budget is leaking.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#0A0F1E] text-white antialiased">{children}</body>
    </html>
  );
}
