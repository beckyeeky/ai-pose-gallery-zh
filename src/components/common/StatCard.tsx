import type { ReactNode } from 'react'

export function StatCard({ title, value, icon, desc }: { title: string; value: ReactNode; icon: ReactNode; desc?: string }) {
  return (
    <div className="group relative min-h-[104px] rounded-2xl border border-border/80 bg-card px-4 py-3.5 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between gap-3">
        <div className="truncate text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">{title}</div>
        <div className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-muted/60 text-muted-foreground transition-colors group-hover:border-vermilion/30 group-hover:text-vermilion [&_svg]:size-3.5">
          {icon}
        </div>
      </div>
      <div className="font-editorial mt-3 truncate text-2xl leading-none font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-2 truncate text-xs text-muted-foreground">{desc || '\u00a0'}</div>
    </div>
  )
}
