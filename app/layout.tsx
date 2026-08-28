import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ayo-baca-anak.audi-prasetyo.chatgpt.site'),
  title: 'Ayo Baca! — Game Belajar Membaca',
  description: 'Game membaca bahasa Indonesia yang ceria untuk anak usia 4–10 tahun.',
  openGraph: {
    title: 'Ayo Baca!',
    description: 'Belajar membaca sambil bermain',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Ayo Baca! — Belajar membaca sambil bermain' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayo Baca!',
    description: 'Belajar membaca sambil bermain',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
