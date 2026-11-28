import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Player } from '@/components/lesson/Player';
import { LESSONS, lessonBySlug } from '@/content/lessons';

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<'/curso/[slug]/jugar'>): Promise<Metadata> {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) return {};
  // The readable lesson page is the one to index; the player is an app screen.
  return { title: `${lesson.title}: lección en curso`, robots: { index: false }, alternates: { canonical: `/curso/${lesson.slug}` } };
}

export default function PlayPage({ params }: PageProps<'/curso/[slug]/jugar'>) {
  return (
    <Suspense fallback={<div className="wrap py-16 text-center font-bold">Cargando la lección…</div>}>
      <PlayContent params={params} />
    </Suspense>
  );
}

async function PlayContent({ params }: { params: Promise<{ slug: string }> }) {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) notFound();
  return (
    <>
      <div aria-hidden className="lesson-bg" />
      <div aria-hidden className="lesson-band" />
      <Player lesson={lesson} />
    </>
  );
}
