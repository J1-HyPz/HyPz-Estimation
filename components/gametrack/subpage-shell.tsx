import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  LayoutDashboard,
  RadioTower,
  Settings,
  Trophy,
  Zap,
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Schedule', href: '/', icon: CalendarDays },
  { label: 'Live scores', href: '/', icon: RadioTower },
  { label: 'Standings', href: '/standings', icon: Trophy },
  { label: 'Saved games', href: '/saved', icon: Bookmark },
  { label: 'Settings', href: '/settings', icon: Settings },
];

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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-sidebar-border bg-sidebar/92 px-4 py-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary shadow-[0_8px_30px_rgb(37_99_235/28%)]">
            <Zap className="size-5 fill-white text-white" />
          </span>
          <div>
            <p className="text-[17px] font-bold tracking-tight">GameTrack</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Every game. One view.
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="mt-9 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === activePath;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/13 text-blue-200 ring-1 ring-primary/15'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <Icon
                  className={`size-[17px] ${active ? 'text-primary' : ''}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center border-b border-white/[0.06] bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6 xl:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              Live data preview
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-7 sm:px-6 xl:px-8 lg:pb-10">
          <div className="mb-7">
            <Link
              href="/"
              className="hidden items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground lg:inline-flex"
            >
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
