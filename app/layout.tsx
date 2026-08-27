import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Make Again｜AI 情绪陪伴原型',
  description: '陪你在失去之后，重新学习如何带着这段关系继续生活。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={geist.variable}>{children}</body></html>;
}
