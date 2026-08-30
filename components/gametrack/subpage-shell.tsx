import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';

export function SubpageShell({
  title,
  description,
  activePath,
  children,
}: {
  title: string;
  description: string;
  activePath: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-4 px-4 sm:px-6 xl:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary shadow-[0_8px_30px_rgb(37_99_235/28%)]">
              <Zap className="size-5 fill-white text-white" />
            </span>
            <div className="hidden sm:block">
              <p className="text-base font-bold tracking-tight">GameTrack</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Football match centre
              </p>
            </div>
          </Link>

          <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
            <Link
              href="/"
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                activePath === '/'
                  ? 'bg-primary/12 text-blue-200'
                  : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
              }`}
            >
              Fixtures
            </Link>
            <Link
              href="/standings"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                activePath === '/standings'
                  ? 'bg-primary/12 text-blue-200'
                  : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground'
              }`}
            >
              <Trophy className="size-3.5" />
              Standings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-7 sm:px-6 xl:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to fixtures
        </Link>
        <div className="mb-7 mt-4">
          <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
