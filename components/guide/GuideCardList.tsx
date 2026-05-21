import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { guideItems, guideTagColors, type GuideItem } from '@/lib/seo'

export type GuideCardVariant = 'compact' | 'full'

function GuideCard({ guide, variant }: { guide: GuideItem; variant: GuideCardVariant }) {
  const color = guideTagColors[guide.tag] ?? '#6bafff'
  const href = `/guide/${guide.slug}`

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="guide-card guide-card--compact inline-reset group"
        style={{ '--guide-accent': color } as CSSProperties}
      >
        <div className="guide-card__top">
          <span className="guide-card__tag">{guide.tag}</span>
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            className="guide-card__corner-icon"
            aria-hidden
          />
        </div>
        <h3 className="guide-card__title">{guide.title}</h3>
        <p className="guide-card__desc">{guide.description}</p>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="guide-card guide-card--full inline-reset group"
      style={{ '--guide-accent': color } as React.CSSProperties}
    >
      <div className="guide-card__top">
        <span className="guide-card__tag">{guide.tag}</span>
        <span className="guide-card__date">UPDATED {guide.updatedAt}</span>
      </div>
      <h2 className="guide-card__title guide-card__title--lg">{guide.title}</h2>
      <p className="guide-card__desc">{guide.description}</p>
      <span className="guide-card__cta">
        가이드 읽기
        <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
      </span>
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
      ? 'grid gap-3 sm:grid-cols-2'
      : 'grid gap-4 sm:grid-cols-2'

  return (
    <div className={[gridClass, className].filter(Boolean).join(' ')}>
      {guideItems.map((guide) => (
        <GuideCard key={guide.slug} guide={guide} variant={variant} />
      ))}
    </div>
  )
}
