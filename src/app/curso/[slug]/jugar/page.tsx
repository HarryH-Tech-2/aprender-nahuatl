import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

export default async function PlayPage({ params }: PageProps<'/curso/[slug]/jugar'>) {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) notFound();
  return <Player lesson={lesson} />;
}
