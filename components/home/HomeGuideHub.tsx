import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import GuideCardList from '@/components/guide/GuideCardList'
import { guideItems } from '@/lib/seo'

/** 메인 하단 — 가이드 허브 + 카드형 가이드 링크 */
export default function HomeGuideHub() {
  const topics = guideItems.map((g) => g.tag).filter((t, i, a) => a.indexOf(t) === i)

  return (
    <section className="home-guide-hub" aria-label="재테크 가이드">
      <header className="home-guide-hub__header">
        <p className="section-label">GUIDES</p>
        <h2 className="section-title">재테크 실전 가이드</h2>
        <p className="home-guide-hub__lead">
          2026년 법령·세율 기준 {guideItems.length}편. 계산 결과를 실무에 적용하는 방법을 정리했습니다.
        </p>
      </header>

      <Link href="/guide" className="home-guide-hub__link inline-reset group">
        <div className="home-guide-hub__glow" aria-hidden />
        <div className="home-guide-hub__inner">
          <div className="home-guide-hub__icon" aria-hidden>
            <BookOpen size={22} strokeWidth={1.8} />
          </div>
          <div className="home-guide-hub__body">
            <p className="text-[13px] font-semibold text-white">가이드 모음 보기</p>
            <p className="mt-1 text-[12px] text-[color:var(--sub)] leading-relaxed">
              전체 목록·최신 수정일 한눈에 확인
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
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

      <GuideCardList variant="compact" className="home-guide-hub__grid" />
    </section>
  )
}
