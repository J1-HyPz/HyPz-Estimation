import { Clock3, Database, Moon, ShieldCheck } from 'lucide-react';

import { SubpageShell } from '@/components/gametrack/subpage-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const settings = [
  {
    title: 'Timezone',
    value: 'Automatic · Europe/London',
    description: 'All fixture times are converted from UTC for display.',
    icon: Clock3,
  },
  {
    title: 'Appearance',
    value: 'GameTrack dark',
    description: 'The high-contrast broadcast theme is enabled across devices.',
    icon: Moon,
  },
  {
    title: 'Saved games',
    value: 'Stored on this device',
    description:
      'Account sync and persistence are planned for a later release.',
    icon: Database,
  },
];

export default function SettingsPage() {
  return (
    <SubpageShell
      title="Settings"
      description="Review how GameTrack displays times and stores local preferences. Account-based settings will arrive after the mock-data MVP."
      activePath="/settings"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {settings.map((setting) => {
          const Icon = setting.icon;
          return (
            <Card
              key={setting.title}
              className="border border-white/[0.08] bg-card/70 p-5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {setting.title}
                </p>
                <p className="mt-2 text-sm font-semibold">{setting.value}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {setting.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">Privacy-first MVP</p>
            <Badge
              variant="outline"
              className="border-emerald-400/20 text-emerald-300"
            >
              Local only
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            GameTrack does not require an account in this preview. Saved game
            IDs remain in your browser storage.
          </p>
        </div>
      </div>
    </SubpageShell>
  );
}
