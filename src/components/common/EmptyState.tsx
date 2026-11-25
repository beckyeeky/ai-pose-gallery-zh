import type { LucideIcon } from 'lucide-react'
import { InboxIcon } from 'lucide-react'

export function EmptyState({ icon: Icon = InboxIcon, title, description }: { icon?: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-muted/60 text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <div className="font-editorial text-base font-medium">{title}</div>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
