import type { Metadata } from 'next';
import { Welcome } from './Welcome';

export const metadata: Metadata = { title: 'Bienvenida al curso completo', robots: { index: false } };

export default function Page() {
  return (
    <div className="wrap max-w-xl py-14 text-center">
      <Welcome />
    </div>
  );
}
