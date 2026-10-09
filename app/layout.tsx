import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexuXTanrı 𖤟 SorguPaneli',
  description: 'Ultra premium cyber-dark demo sorgulama ve yönetim platformu. 12 kategori, 101 sentetik sorgu modülü, anahtar yönetimi ve denetim logları.',
  openGraph: {
    title: 'NexuXTanrı 𖤟 SorguPaneli',
    description: 'Ultra premium cyber-dark demo sorgulama ve yönetim platformu. 12 kategori, 101 sentetik sorgu modülü.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexuXTanrı 𖤟 SorguPaneli',
    description: 'Ultra premium cyber-dark demo sorgulama ve yönetim platformu.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-[#050609] text-[#F0F2F6] antialiased selection:bg-[#C8103D]/40 selection:text-[#F0204F]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
