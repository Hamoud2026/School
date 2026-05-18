import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'School Platform', description: 'School management platform' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
