import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  CheckIcon,
  DicesIcon,
  FlameIcon,
  LayersIcon,
  PersonStandingIcon,
  PlusIcon,
  ShieldAlertIcon,
  ShirtIcon,
  SparklesIcon,
  UserRoundIcon,
} from 'lucide-react'
import { costumesQuery, isNsfwCostume, isNsfwPose, portraitsQuery, posesQuery } from '@/api/gallery'
import { StatCard } from '@/components/common/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { poseThumbPath, referenceImageUrl } from '@/lib/recipeImages'
import { cn } from '@/lib/utils'
import { useStudio } from '@/store/studioStore'

export const Route = createFileRoute('/')({
  staticData: { title: '图库总览' },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(posesQuery),
      context.queryClient.ensureQueryData(costumesQuery),
      context.queryClient.ensureQueryData(portraitsQuery),
    ]),
  pendingComponent: () => <Skeleton className="h-[520px] rounded-2xl" />,
  component: DashboardPage,
})

function DashboardPage() {
  const { data: posesData } = useSuspenseQuery(posesQuery)
  const { data: costumes } = useSuspenseQuery(costumesQuery)
  const { data: portraits } = useSuspenseQuery(portraitsQuery)
  const { recipe, safeMode, togglePortrait, randomizeRecipe } = useStudio()

  const topPortraits = portraits.filter((p) => p.热门).slice(0, 10)
  const totalImages = posesData.items.length + costumes.length + portraits.length
  const poseSamples = posesData.groups.filter((item) => !safeMode || !isNsfwPose(item)).slice(0, 4)
  const costumeSamples = costumes.filter((item) => !safeMode || !isNsfwCostume(item)).slice(0, 4)

  const previewPortrait = recipe.portrait ?? portraits[0]
  const previewCostume = recipe.costume && (!safeMode || !isNsfwCostume(recipe.costume)) ? recipe.costume : costumeSamples[0]
  const previewPose = recipe.pose && (!safeMode || !isNsfwPose(recipe.pose)) ? recipe.pose : poseSamples[0]?.order[0]

  const handleRandom = () => {
    randomizeRecipe({
      poses: posesData.items,
      costumes,
      portraits,
    })
  }

  return (
    <>
      {/* 编辑部主视觉标头 + 实时三联画标本预览 */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 sm:p-7 lg:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-vermilion" />
              <span>Pose &amp; Character Atlas · Atelier</span>
            </div>

            <h1 className="font-editorial text-2xl leading-[1.15] font-semibold tracking-tight sm:text-3xl lg:text-[2.35rem]">
              以三合一参考，定格角色神韵
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              收录多角度人体素体、写实与二次元服饰及 CC0 人像发型。自由装配「人像 + 服装 + 姿势」角色配方，或直连云端与本地 ComfyUI 合成定稿。
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button asChild size="default" className="rounded-full px-5 shadow-xs">
                <Link to="/studio">
                  <SparklesIcon className="size-4 text-vermilion dark:text-vermilion" />
                  进入 AI 合成台
                </Link>
              </Button>
              <Button variant="outline" size="default" onClick={handleRandom} className="rounded-full bg-background/80 px-4">
                <DicesIcon className="size-4" />
                随机装配一套配方
              </Button>
            </div>
          </div>

          {/* 右侧三联画标本预览 (Triptych Specimen) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <Link
              to="/portraits"
              className="group relative overflow-hidden rounded-xl border border-border/80 bg-background p-1.5 transition hover:-translate-y-0.5 hover:border-foreground/25"
            >
              <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                <span>01 Face</span>
                {recipe.portrait && <span className="size-1.5 rounded-full bg-vermilion" />}
              </div>
              <div className="aspect-3/4 overflow-hidden rounded-lg bg-muted">
                {previewPortrait && (
                  <img
                    src={referenceImageUrl(previewPortrait.缩略图)}
                    alt={previewPortrait.标题}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-1.5 truncate px-1 text-[11px] font-medium">
                {previewPortrait?.发型名称 ?? '人像参考'}
              </div>
            </Link>

            <Link
              to="/costumes"
              className="group relative overflow-hidden rounded-xl border border-border/80 bg-background p-1.5 transition hover:-translate-y-0.5 hover:border-foreground/25"
            >
              <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                <span>02 Look</span>
                {recipe.costume && <span className="size-1.5 rounded-full bg-vermilion" />}
              </div>
              <div className="aspect-3/4 overflow-hidden rounded-lg bg-muted">
                {previewCostume && (
                  <img
                    src={referenceImageUrl(previewCostume.缩略图)}
                    alt={previewCostume.服装名称}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-1.5 truncate px-1 text-[11px] font-medium">
                {previewCostume?.服装名称 ?? '服装穿搭'}
              </div>
            </Link>

            <Link
              to="/poses"
              className="group relative overflow-hidden rounded-xl border border-border/80 bg-background p-1.5 transition hover:-translate-y-0.5 hover:border-foreground/25"
            >
              <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                <span>03 Pose</span>
                {recipe.pose && <span className="size-1.5 rounded-full bg-vermilion" />}
              </div>
              <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                {previewPose && (
                  <img
                    src={referenceImageUrl(poseThumbPath(previewPose))}
                    alt={previewPose.姿势名称}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-1.5 truncate px-1 text-[11px] font-medium">
                {previewPose?.姿势名称 ?? '动作素体'}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 核心数据指标卡片 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="总参考图"
          value={totalImages.toLocaleString('zh-CN')}
          icon={<LayersIcon />}
          desc="11,568 本地高清图"
        />
        <StatCard
          title="动作姿势 (Pose)"
          value={`${posesData.groups.length} 组`}
          icon={<PersonStandingIcon />}
          desc={`${posesData.items.length.toLocaleString('zh-CN')} 张 · 白模/深度`}
        />
        <StatCard
          title="服装穿搭 (Costume)"
          value={`${costumes.length.toLocaleString('zh-CN')} 套`}
          icon={<ShirtIcon />}
          desc="现实 1,407 · 二次元 440"
        />
        <StatCard
          title="人像颜值 (Portrait)"
          value={`${portraits.length.toLocaleString('zh-CN')} 张`}
          icon={<UserRoundIcon />}
          desc="CC0 协议 · 51 款发型"
        />
      </div>

      {/* 三大核心图库入口卡片 */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Link
          to="/poses"
          className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Archive 01</div>
              <h2 className="font-editorial mt-0.5 flex items-center gap-1.5 text-base font-semibold">
                <PersonStandingIcon className="size-4 text-vermilion" />
                动作姿势库
              </h2>
            </div>
            <Badge variant="secondary" className="bg-muted font-medium tabular-nums">
              {posesData.items.length.toLocaleString('zh-CN')}
            </Badge>
          </div>
          <div className="mt-3.5 grid grid-cols-4 gap-1.5">
            {poseSamples.map((g) => (
              <div key={g.key} className="aspect-3/4 overflow-hidden rounded-lg border border-border/60 bg-white">
                <img
                  src={`/${g.order[0].缩略图}`}
                  alt={g.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Link>

        <Link
          to="/costumes"
          className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Archive 02</div>
              <h2 className="font-editorial mt-0.5 flex items-center gap-1.5 text-base font-semibold">
                <ShirtIcon className="size-4 text-vermilion" />
                服装穿搭库
              </h2>
            </div>
            <Badge variant="secondary" className="bg-muted font-medium tabular-nums">
              {costumes.length.toLocaleString('zh-CN')}
            </Badge>
          </div>
          <div className="mt-3.5 grid grid-cols-4 gap-1.5">
            {costumeSamples.map((c) => (
              <div key={c.id} className="aspect-3/4 overflow-hidden rounded-lg border border-border/60 bg-muted">
                <img
                  src={referenceImageUrl(c.缩略图)}
                  alt={c.服装名称}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Link>

        <Link
          to="/portraits"
          className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Archive 03</div>
              <h2 className="font-editorial mt-0.5 flex items-center gap-1.5 text-base font-semibold">
                <UserRoundIcon className="size-4 text-vermilion" />
                人像颜值库
              </h2>
            </div>
            <Badge variant="secondary" className="bg-muted font-medium tabular-nums">
              {portraits.length.toLocaleString('zh-CN')}
            </Badge>
          </div>
          <div className="mt-3.5 grid grid-cols-4 gap-1.5">
            {portraits.slice(0, 4).map((p) => (
              <div key={p.id} className="aspect-3/4 overflow-hidden rounded-lg border border-border/60 bg-muted">
                <img
                  src={`/${p.缩略图}`}
                  alt={p.标题}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* 热门人像 Top10 速选区 */}
      <section className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <FlameIcon className="size-4 text-vermilion" />
            <h2 className="font-editorial text-base font-semibold">热门人像 Top 10</h2>
            <span className="hidden text-xs text-muted-foreground sm:inline">· 点击即可加入角色配方</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link to="/portraits">
              浏览全部
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5 lg:grid-cols-10">
          {topPortraits.map((item, idx) => {
            const picked = recipe.portrait?.id === item.id
            return (
              <div
                key={item.id}
                onClick={() => togglePortrait(item)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-xl border bg-background transition hover:-translate-y-0.5 hover:shadow-md',
                  picked ? 'border-vermilion ring-2 ring-vermilion/30' : 'border-border/70'
                )}
              >
                <div className="relative aspect-4/5 overflow-hidden bg-muted">
                  <img
                    src={`/${item.缩略图}`}
                    alt={item.标题}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white tabular-nums backdrop-blur-xs">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full text-white shadow transition-colors',
                      picked ? 'bg-vermilion' : 'bg-black/65 group-hover:bg-foreground'
                    )}
                  >
                    {picked ? <CheckIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
                  </span>
                </div>
                <div className="p-2">
                  <div className="truncate text-[11px] font-medium">{item.发型名称}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 底部免责声明提示条 */}
      <footer className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-vermilion/80" />
        <div>
          <strong className="text-foreground">免责声明：</strong>
          本站原有姿势与现实服饰参考图源自 X 创作者{' '}
          <a
            href="https://x.com/giaaibusi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-2 hover:text-foreground"
          >
            ギア (@giaaibusi)
          </a>{' '}
          公开分享。新增二次元服装来自 たき AI · CharaDB，仅收录元数据，图片从来源站点读取，各素材适用各自条件。默认已开启「安全模式 (SFW)」隐藏 18+ 敏感分类，未满 18 周岁请勿关闭。本工具与素材
          <strong className="text-foreground">仅供个人学习与合法艺术创作使用，严禁用于任何违法违规或侵害他人肖像权用途</strong>。{' '}
          <Link to="/guide" className="font-medium text-vermilion underline underline-offset-2 hover:opacity-80">
            查看完整免责声明 →
          </Link>
        </div>
      </footer>
    </>
  )
}
