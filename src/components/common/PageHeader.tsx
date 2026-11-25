import type { ReactNode } from 'react'

export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
}: {
  title: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            <span className="inline-block size-1.5 rounded-full bg-vermilion" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="font-editorial truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>}
      </div>
      {actions && <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5 sm:gap-2">{actions}</div>}
    </div>
  )
}
