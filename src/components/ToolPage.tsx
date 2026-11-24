import Image from 'next/image';
import type { ReactNode } from 'react';
import { Breadcrumbs, Faq } from './Seo';
import { SIGNS } from '@/content/signs';

/** Shared frame for the tool pages: breadcrumbs, glyph, title, lead paragraph, the tool, then an optional FAQ. */
export function ToolPage({
  sign, title, lead, href, faq, children,
}: { sign: number; title: string; lead: ReactNode; href: string; faq?: [string, string][]; children: ReactNode }) {
  const s = SIGNS[sign - 1];
  return (
    <div className="wrap py-10">
      <Breadcrumbs trail={[['/herramientas', 'Herramientas'], [href, title]]} />
      <div className="mt-6 flex items-start gap-5">
        <span className="sign hidden w-24 shrink-0 sm:block" style={{ aspectRatio: '1' }}>
          <Image src={s.img} alt="" width={192} height={192} sizes="96px" priority />
        </span>
        <div className="prose-col">
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          <div className="mt-3 text-lg">{lead}</div>
        </div>
      </div>
      <div className="mt-8">{children}</div>
      {faq && <Faq items={faq} />}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-col mt-12 space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc">{children}</div>;
}
