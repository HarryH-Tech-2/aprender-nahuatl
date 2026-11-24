import Image from 'next/image';
import Link from 'next/link';
import { SIGNS } from '@/content/signs';
import { TOOLS } from '@/lib/site';

export function ToolGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((t) => (
        <li key={t.href}>
          <Link href={t.href} className="plate flex h-full items-start gap-4 p-4 hover:bg-maize-soft">
            <span className="sign w-16 shrink-0" style={{ aspectRatio: '1' }}>
              <Image src={SIGNS[t.sign - 1].img} alt="" width={128} height={128} sizes="64px" />
            </span>
            <span>
              <span className="display block text-xl leading-tight">{t.title}</span>
              <span className="mt-1 block leading-snug">{t.blurb}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
