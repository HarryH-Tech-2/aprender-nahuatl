import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

/** Structured data for search engines and AI answer engines. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export type Crumb = [href: string, label: string];

/** Visible breadcrumb trail plus its BreadcrumbList schema. The home crumb is added automatically. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all: Crumb[] = [['/', 'Inicio'], ...trail];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map(([href, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${href === '/' ? '' : href}` })),
        }}
      />
      <nav aria-label="Ruta" className="text-sm font-bold">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map(([href, label], i) => (
            <li key={href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="opacity-50">/</span>}
              {i < all.length - 1 ? (
                <Link href={href} className="underline underline-offset-4 hover:text-cochineal">{label}</Link>
              ) : (
                <span aria-current="page" className="opacity-70">{label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Animated FAQ list with FAQPage schema. Answers are plain text so they can be quoted as-is. */
export function Faq({ items, title = 'Preguntas frecuentes', id = 'preguntas' }: { items: [string, string][]; title?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className="mt-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        }}
      />
      <h2 id={id} className="text-3xl">{title}</h2>
      <div className="mt-6 max-w-3xl space-y-3">
        {items.map(([q, a]) => (
          <details key={q} className="faq plate-flat transition-colors">
            <summary className="flex items-center justify-between gap-4 p-4">
              <h3 className="font-sans text-lg font-bold">{q}</h3>
              <span aria-hidden className="faq-icon display text-2xl text-cochineal">+</span>
            </summary>
            <p className="px-4 pb-5 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
