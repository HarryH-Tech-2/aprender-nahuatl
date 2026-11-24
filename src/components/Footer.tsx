import Link from 'next/link';
import { TOOLS } from '@/lib/site';

export function Footer() {
  return (
    <footer className="on-dark mt-16">
      <div className="greca" aria-hidden />
      <div className="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="display text-2xl">Aprender Náhuatl</p>
          <p className="mt-3 text-sm leading-relaxed opacity-90">
            Un curso gratuito para acercarse a una lengua viva de México, hablada hoy por más de un millón y medio de personas.
          </p>
        </div>
        <nav aria-label="Aprender">
          <p className="mb-2 font-bold text-maize">Aprender</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link className="underline" href="/curso/sonidos-y-saludos">Lección 1</Link></li>
            <li><Link className="underline" href="/curso">El curso completo</Link></li>
            <li><Link className="underline" href="/juegos">Juegos</Link></li>
            <li><Link className="underline" href="/palabra-del-dia">Palabra del día</Link></li>
          </ul>
        </nav>
        <nav aria-label="Herramientas">
          <p className="mb-2 font-bold text-maize">Herramientas</p>
          <ul className="space-y-1.5 text-sm">
            {TOOLS.map((t) => (
              <li key={t.href}><Link className="underline" href={t.href}>{t.title}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="El sitio">
          <p className="mb-2 font-bold text-maize">El sitio</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link className="underline" href="/acerca">Acerca</Link></li>
            <li><Link className="underline" href="/contacto">Contacto</Link></li>
            <li><Link className="underline" href="/privacidad">Aviso de privacidad</Link></li>
            <li><Link className="underline" href="/terminos">Términos de uso</Link></li>
          </ul>
        </nav>
      </div>
      <div className="wrap border-t border-amate/25 py-5 text-sm">
        <p>
          <strong className="text-maize">Contenido en revisión.</strong> Las lecciones todavía no han sido revisadas por hablantes nativos;
          puede haber errores. Si encuentras uno, <Link className="underline" href="/contacto">avísanos</Link>.
        </p>
      </div>
    </footer>
  );
}
