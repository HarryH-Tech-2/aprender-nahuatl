'use client';
import { useMemo, useState } from 'react';
import { CATEGORIAS, NAHUATLISMOS, type Nahuatlismo } from '@/content/nahuatlismos';
import { TOPONIMOS } from '@/content/toponimos';
import { normalize } from '@/lib/answers';
import { dictionary } from '@/lib/dictionary';
import { pick } from '@/lib/variant';

function Search({ id, label, value, onChange, count }: { id: string; label: string; value: string; onChange: (s: string) => void; count: number }) {
  return (
    <div className="max-w-md">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type="search" className="field" value={value} autoComplete="off" onChange={(e) => onChange(e.target.value)} />
      <p role="status" className="mt-2 text-sm font-bold">
        {count === 0 ? 'Sin resultados. Prueba con menos letras.' : `${count} ${count === 1 ? 'resultado' : 'resultados'}`}
      </p>
    </div>
  );
}

export function ToponimosList() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = normalize(q);
    return TOPONIMOS.filter((t) => !n || normalize(`${t.name} ${t.nah} ${t.where} ${t.meaning}`).includes(n));
  }, [q]);
  return (
    <div>
      <Search id="buscar-lugar" label="Busca tu ciudad, alcaldía o estado" value={q} onChange={setQ} count={list.length} />
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((t) => (
          <li key={t.name} className="plate-flat p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h2 className="text-2xl">{t.name}</h2>
              <p className="text-sm">{t.where}</p>
            </div>
            <p className="mt-1 text-lg font-bold">«{t.meaning}»</p>
            <p className="mt-2">En náhuatl: <span lang="nah" className="nah">{t.nah}</span></p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {t.parts.map(([piece, meaning], i) => (
                <li key={i} className="rounded-lg border-2 border-ink bg-amate px-2.5 py-1 text-sm">
                  <span lang="nah" className="nah">{piece}</span> {meaning}
                </li>
              ))}
            </ul>
            {t.doubtful && <p className="mt-2 text-sm opacity-80">Los especialistas no se ponen de acuerdo sobre este origen.</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NahuatlismosList() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Nahuatlismo['cat'] | 'todas'>('todas');
  const list = useMemo(() => {
    const n = normalize(q);
    return NAHUATLISMOS.filter((w) => (cat === 'todas' || w.cat === cat) && (!n || normalize(`${w.es} ${w.nah} ${w.note}`).includes(n)));
  }, [q, cat]);
  const cats = [['todas', 'Todas'], ...Object.entries(CATEGORIAS)] as [Nahuatlismo['cat'] | 'todas', string][];
  return (
    <div>
      <div role="group" aria-label="Categoría" className="mb-5 flex flex-wrap gap-2">
        {cats.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={cat === id} className="tile !min-h-10 !px-3 !py-1 !text-base" onClick={() => setCat(id)}>
            {label}
          </button>
        ))}
      </div>
      <Search id="buscar-palabra" label="Busca una palabra" value={q} onChange={setQ} count={list.length} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => (
          <li key={w.es} className="plate-flat p-3.5">
            <p className="text-xl font-bold">{w.es}</p>
            {w.nah !== '—' && <p lang="nah" className="nah text-lg">{w.nah}</p>}
            <p className="mt-1 text-[0.95rem] leading-snug">{w.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DictionaryList() {
  const words = useMemo(() => dictionary(), []);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = normalize(q);
    return words.filter((w) => !n || normalize(`${pick(w.nah, 'central')} ${pick(w.nah, 'huasteca')} ${w.es}`).includes(n));
  }, [q, words]);
  return (
    <div>
      <Search id="buscar-dicc" label="Busca en náhuatl o en español" value={q} onChange={setQ} count={list.length} />
      <div className="plate-flat mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left">
          <thead className="bg-amate-deep">
            <tr>
              <th scope="col" className="px-4 py-2.5">Español</th>
              <th scope="col" className="px-4 py-2.5">Náhuatl central</th>
              <th scope="col" className="px-4 py-2.5">Náhuatl de la Huasteca</th>
              <th scope="col" className="px-4 py-2.5">Lección</th>
            </tr>
          </thead>
          <tbody>
            {list.map((w) => (
              <tr key={w.id} className="border-t-2 border-ink/15 align-top">
                <td className="px-4 py-2">{w.es}</td>
                <td className="px-4 py-2"><span lang="nah" className="nah">{pick(w.nah, 'central')}</span></td>
                <td className="px-4 py-2"><span lang="nah" className="nah">{pick(w.nah, 'huasteca')}</span></td>
                <td className="px-4 py-2 tabular-nums">{w.lesson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
