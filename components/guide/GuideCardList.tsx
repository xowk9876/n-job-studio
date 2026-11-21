import type { CSSProperties } from 'react'
import Link from 'next/link'
import { guideItems, guideTagColors, type GuideItem } from '@/lib/seo'

function GuideCard({ guide }: { guide: GuideItem }) {
  const color = guideTagColors[guide.tag] ?? '#6bafff'

  return (
    <Link
      href={`/guide/${guide.slug}`}
      className="guide-card inline-reset"
      style={{ '--guide-accent': color } as CSSProperties}
    >
      <div className="guide-card__top">
        <span className="guide-card__tag">{guide.tag}</span>
        <time dateTime={guide.updatedAt} className="guide-card__date">수정 {guide.updatedAt}</time>
      </div>
      <h2 className="guide-card__title">{guide.title}</h2>
      <p className="guide-card__desc">{guide.description}</p>
    </Link>
  )
}

export default function GuideCardList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {guideItems.map(guide => <GuideCard key={guide.slug} guide={guide} />)}
    </div>
  )
}
