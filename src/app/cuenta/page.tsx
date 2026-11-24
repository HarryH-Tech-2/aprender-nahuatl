import type { Metadata } from 'next';
import { AccountPanel } from '@/components/AccountPanel';

export const metadata: Metadata = { title: 'Mi cuenta', robots: { index: false } };

export default function Page() {
  return (
    <div className="wrap max-w-3xl py-10">
      <h1 className="text-4xl sm:text-5xl">Mi cuenta</h1>
      <div className="mt-6"><AccountPanel /></div>
    </div>
  );
}
