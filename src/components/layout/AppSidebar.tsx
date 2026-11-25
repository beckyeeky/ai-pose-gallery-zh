import { Link, useLocation } from '@tanstack/react-router'
import { ExternalLinkIcon, LayersIcon, SparklesIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useStudio } from '@/store/studioStore'
import { activeNavTo, navGroups } from './nav'

export function AppSidebar() {
  const pathname = useLocation({ select: (l) => l.pathname })
  const active = activeNavTo(pathname)
  const { recipe } = useStudio()
  const count = [recipe.portrait, recipe.costume, recipe.pose].filter(Boolean).length

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-xs">
                  <LayersIcon className="size-4" />
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-vermilion ring-2 ring-sidebar" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="font-editorial truncate text-sm font-semibold tracking-tight">POSE &amp; CHARACTER</span>
                  <span className="truncate text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Atelier Reference</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={item.to === active} tooltip={item.title}>
                    <Link to={item.to}>
                      <item.icon />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === 'PRO' ? 'default' : 'secondary'}
                          className={
                            item.badge === 'PRO'
                              ? 'ml-auto h-5 border border-vermilion/25 bg-vermilion/12 px-1.5 text-[10px] font-semibold tracking-wider text-vermilion'
                              : 'ml-auto h-5 bg-background/70 px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums'
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="当前角色配方">
              <Link to="/studio" className="bg-sidebar-accent/70 hover:bg-sidebar-accent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SparklesIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold">角色配方槽 ({count}/3)</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {count === 0 ? '未选择 · 点击去捏人' : '点击进入 AI 合成台'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild tooltip="访问 GitHub 仓库">
              <a
                href="https://github.com/anhao/ai-pose-gallery-zh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground"
              >
                <ExternalLinkIcon className="size-3.5" />
                <span>GitHub · @anhao_ai</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
