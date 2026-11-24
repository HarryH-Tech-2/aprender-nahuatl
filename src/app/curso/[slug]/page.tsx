import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonStart } from '@/components/lesson/LessonStart';
import { VocabTable } from '@/components/VocabTable';
import { LESSONS, lessonBySlug } from '@/content/lessons';
import { SIGNS } from '@/content/signs';

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<'/curso/[slug]'>): Promise<Metadata> {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) return {};
  return {
    title: `Lección ${lesson.n}: ${lesson.title}`,
    description: `${lesson.subtitle}. ${lesson.intro}`.slice(0, 158),
    alternates: { canonical: `/curso/${lesson.slug}` },
  };
}

export default async function LessonPage({ params }: PageProps<'/curso/[slug]'>) {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) notFound();
  const sign = SIGNS[lesson.n - 1];
  const topics = lesson.steps.filter((s) => s.type === 'info').map((s) => s.title).slice(0, -1);

  return (
    <div className="wrap py-10">
      <p className="text-sm font-bold">
        <Link href="/curso" className="underline underline-offset-4">Curso</Link> / Lección {lesson.n}
      </p>
      <div className="mt-4 grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
        <div className="sign w-36 md:w-52" style={{ aspectRatio: '1' }}>
          <Image src={sign.img} alt={`Glifo de ${sign.nah}, ${sign.es.toLowerCase()}`} width={416} height={416} priority sizes="208px" />
        </div>
        <div className="prose-col">
          <p className="font-bold text-cochineal">Signo {sign.n}: {sign.nah}, {sign.es.toLowerCase()}</p>
          <h1 className="mt-1 text-4xl sm:text-5xl">{lesson.title}</h1>
          <p className="mt-2 text-xl">{lesson.subtitle}</p>
          <p className="mt-4">{lesson.intro}</p>
          <LessonStart slug={lesson.slug} n={lesson.n} minutes={lesson.minutes} />
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl">Lo que vas a aprender</h2>
          <ul className="mt-4 list-disc space-y-1.5 pl-6">
            {topics.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="mt-6 rounded-xl border-2 border-dashed border-ink/50 p-3 text-sm">
            <strong>Contenido en revisión.</strong> Esta lección aún no ha sido revisada por hablantes nativos.
          </p>
        </section>
        <section>
          <h2 className="text-2xl">Vocabulario de la lección</h2>
          <div className="mt-4"><VocabTable words={lesson.vocab} /></div>
        </section>
      </div>
    </div>
  );
}
