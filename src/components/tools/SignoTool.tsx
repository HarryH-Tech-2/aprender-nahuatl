'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useAppState } from '../AppState';
import { SIGNS } from '@/content/signs';
import { toNahuatl } from '@/lib/numbers';
import { isValidDate, tonalli } from '@/lib/tonalpohualli';
import { SITE_URL } from '@/lib/site';

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

type Result = { number: number; signIndex: number; date: string };

export function SignoTool() {
  const { variant } = useAppState();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [shared, setShared] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShared('');
    const d = Number(day), m = Number(month), y = Number(year);
    if (!day || !month || year.length !== 4 || y < 1000 || !isValidDate(y, m, d)) {
      setResult(null);
      setError('Esa fecha no existe. Revisa el día, el mes y el año (con cuatro cifras).');
      return;
    }
    setError('');
    setResult({ ...tonalli(y, m, d), date: `${d} de ${MONTHS[m - 1]} de ${y}` });
  }

  const sign = result ? SIGNS[result.signIndex] : null;
  const numberWord = result ? toNahuatl(result.number, variant) : null;
  const nahName = result && sign && numberWord?.ok ? `${numberWord.words} ${sign.nah.toLowerCase()}` : '';

  async function share() {
    if (!result || !sign) return;
    const text = `Mi signo en el tonalpohualli es ${result.number} ${sign.nah} (${sign.es}). ¿Cuál es el tuyo?`;
    const url = `${SITE_URL}/tu-signo`;
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared('Texto copiado. Pégalo donde quieras.');
    } catch {
      setShared('No se pudo compartir desde este navegador.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend className="label">Tu fecha de nacimiento</legend>
          <div className="grid grid-cols-[4.5rem_1fr_6rem] gap-2">
            <div>
              <label htmlFor="dia" className="text-sm font-bold">Día</label>
              <input id="dia" className="field" inputMode="numeric" maxLength={2} autoComplete="bday-day" value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <label htmlFor="mes" className="text-sm font-bold">Mes</label>
              <select id="mes" className="field" autoComplete="bday-month" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Elige</option>
                {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="anio" className="text-sm font-bold">Año</label>
              <input id="anio" className="field" inputMode="numeric" maxLength={4} autoComplete="bday-year" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
        </fieldset>
        <button type="submit" className="btn btn-red mt-4 w-full">Ver mi signo</button>
        <p role="alert" className="mt-3 min-h-6 font-bold text-cochineal">{error}</p>
        <p className="text-sm">La fecha no se guarda ni se envía a ningún lado: el cálculo se hace en tu dispositivo.</p>
      </form>

      <div aria-live="polite">
        {result && sign ? (
          <div className="plate overflow-hidden">
            <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start">
              <span className="sign pop w-40 shrink-0" style={{ aspectRatio: '1' }}>
                <Image src={sign.img} alt={`Glifo de ${sign.nah}`} width={320} height={320} sizes="160px" />
              </span>
              <div>
                <p className="text-sm font-bold">Naciste el {result.date}, día</p>
                <p className="display text-4xl sm:text-5xl">{result.number} {sign.nah}</p>
                <p className="mt-1 text-xl font-bold">{result.number} {sign.es}</p>
                {nahName && <p className="mt-1">En náhuatl: <span lang="nah" className="nah">{nahName}</span></p>}
                <p className="mt-3">{sign.meaning}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t-[3px] border-ink bg-amate-deep p-4">
              <button type="button" className="btn btn-sm" onClick={share}>Compartir mi signo</button>
              <span role="status" className="text-sm font-bold">{shared}</span>
            </div>
          </div>
        ) : (
          <div className="plate-flat grid grid-cols-5 gap-2 p-4 sm:grid-cols-10" aria-hidden>
            {SIGNS.map((s) => (
              <span key={s.n} className="sign" style={{ aspectRatio: '1' }}>
                <Image src={s.img} alt="" width={120} height={120} sizes="60px" />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
