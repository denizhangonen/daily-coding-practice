// app/page.tsx
import Link from 'next/link';
import { getAllChallenges } from '@/lib/content';

export default async function Home() {
  const items = await getAllChallenges();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold mb-4">Daily Coding Practice</h1>

      {items.length === 0 && <p className="opacity-70">No challenges yet.</p>}

      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.slug}>
            <Link
              href={`/${i.slug}`}
              className="block rounded-lg border border-white/10 p-4 hover:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{i.title}</span>
                <span className="text-xs opacity-60">{i.date}</span>
              </div>
              <div className="text-xs opacity-70 mt-1">
                {i.platform ?? 'Unknown'}{' '}
                {i.difficulty ? `• ${i.difficulty}` : ''}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

