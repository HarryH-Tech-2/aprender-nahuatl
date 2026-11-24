'use client';
import { Nah } from './Nah';
import type { Word } from '@/content/types';

export function VocabTable({ words }: { words: Word[] }) {
  return (
    <div className="plate-flat overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-amate-deep">
          <tr>
            <th scope="col" className="px-4 py-2.5">Náhuatl</th>
            <th scope="col" className="px-4 py-2.5">Español</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => (
            <tr key={w.id} className="border-t-2 border-ink/15 align-top">
              <td className="px-4 py-2 text-lg"><Nah v={w.nah} /></td>
              <td className="px-4 py-2">
                {w.es}
                {w.note && <span className="block text-sm opacity-75">{w.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
