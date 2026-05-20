import Link from 'next/link'
import { guideItems, guideTagColors, type GuideItem } from '@/lib/seo'

export type GuideCardVariant = 'compact' | 'full'

function GuideCard({ guide, variant }: { guide: GuideItem; variant: GuideCardVariant }) {
  const color = guideTagColors[guide.tag] ?? '#6bafff'
  const href = `/guide/${guide.slug}`

  if (variant === 'compact') {
    return (
      <Link href={href} className="inline-reset card card-hover p-5 group">
        <span
          className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 tracking-wide"
          style={{
            color,
            background: `${color}10`,
            border: `1px solid ${color}20`,
          }}
        >
          {guide.tag}
        </span>
        <h3 className="font-display text-[14.5px] font-semibold text-white tracking-tight leading-snug group-hover:text-[color:var(--brand)] transition-colors">
          {guide.title}
        </h3>
        <p className="mt-2 text-[12px] text-[color:var(--sub)] leading-relaxed line-clamp-2">
          {guide.description}
        </p>
      </Link>
    )
  }

  return (
    <Link href={href} className="inline-reset card card-hover p-5 group">
      <span
        className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full mb-3"
        style={{
          color,
          background: `${color}14`,
          border: `1px solid ${color}28`,
        }}
      >
        {guide.tag}
      </span>
      <h2 className="font-display text-[16px] font-semibold text-white tracking-tight mb-1.5 group-hover:text-[color:var(--brand)] transition-colors">
        {guide.title}
      </h2>
      <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed">{guide.description}</p>
      <p className="mt-2.5 text-[10.5px] text-[color:var(--muted)] font-mono">UPDATED {guide.updatedAt}</p>
    </Link>
  )
}

type GuideCardListProps = {
  variant?: GuideCardVariant
  className?: string
}

/** guideItems 단일 소스 — 메인·가이드 목록 공통 */
export default function GuideCardList({ variant = 'full', className = '' }: GuideCardListProps) {
  const gridClass =
    variant === 'compact'
      ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid gap-2.5 sm:grid-cols-2'

  return (
    <div className={[gridClass, className].filter(Boolean).join(' ')}>
      {guideItems.map((guide) => (
        <GuideCard key={guide.slug} guide={guide} variant={variant} />
      ))}
    </div>
  )
}
