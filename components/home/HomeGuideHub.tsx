import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { guideItems } from '@/lib/seo'

/** 메인 하단 — 가이드 허브 (6장 카드 그리드 대신 단일 진입점) */
export default function HomeGuideHub() {
  const topics = guideItems.map((g) => g.tag).filter((t, i, a) => a.indexOf(t) === i)

  return (
    <section className="home-guide-hub" aria-label="재테크 가이드">
      <Link href="/guide" className="home-guide-hub__link inline-reset group">
        <div className="home-guide-hub__glow" aria-hidden />
        <div className="home-guide-hub__inner">
          <div className="home-guide-hub__icon" aria-hidden>
            <BookOpen size={22} strokeWidth={1.8} />
          </div>
          <div className="home-guide-hub__body">
            <p className="section-label mb-2">GUIDES</p>
            <h2 className="font-display text-[20px] md:text-[22px] font-semibold text-white tracking-tight">
              재테크 실전 가이드
            </h2>
            <p className="mt-2 text-[13px] text-[color:var(--sub)] leading-relaxed max-w-md">
              2026년 법령·세율 기준으로 작성된 {guideItems.length}편의 가이드. 계산 결과를 실무에
              적용하는 방법을 정리했습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((tag) => (
                <span key={tag} className="home-guide-hub__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span className="home-guide-hub__arrow" aria-hidden>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </section>
  )
}
