import type { Lesson } from '../types';
import { lesson01 } from './01-sonidos-y-saludos';
import { lesson02 } from './02-palabras-que-ya-conoces';
import { lesson03 } from './03-yo-soy-tu-eres';
import { lesson04 } from './04-contar-de-veinte-en-veinte';
import { lesson05 } from './05-mi-casa-mi-familia';
import { lesson06 } from './06-que-haces';
import { lesson07 } from './07-lugares-y-caminos';
import { lesson08 } from './08-tu-primera-conversacion';

export const LESSONS: Lesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08];

export const lessonBySlug = (slug: string): Lesson | undefined => LESSONS.find((l) => l.slug === slug);
