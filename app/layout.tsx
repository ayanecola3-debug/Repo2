import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Birthday Bloom | Make a wish come true', description: 'Create a personal birthday experience.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
