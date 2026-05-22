import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { guideItems, guideTagColors } from '@/lib/seo'

const topicOrder = ['세금', '대출', '퇴직', '투자', '부동산', '복권'] as const

/** 메인 하단 — 가이드 허브 배너 (목록은 /guide·푸터) */
export default function HomeGuideHub() {
  const availableTopics = new Set(guideItems.map((g) => g.tag))
  const topics = topicOrder.filter((tag) => availableTopics.has(tag))
  const count = guideItems.length

  return (
    <section className="home-guide-hub" aria-label="재테크 가이드">
      <header className="home-guide-hub__header">
        <p className="section-label">GUIDES</p>
        <h2 className="section-title">재테크 실전 가이드</h2>
        <p className="home-guide-hub__lead">
          2026년 법령·세율 기준 {count}편. 계산 결과를 실무에 적용하는 방법을 정리했습니다.
        </p>
      </header>

      <Link href="/guide" className="home-guide-hub__card inline-reset group">
        <div className="home-guide-hub__card-shine" aria-hidden />
        <div className="home-guide-hub__card-grid">
          <div className="home-guide-hub__intro">
            <div className="home-guide-hub__icon" aria-hidden>
              <BookOpen size={20} strokeWidth={1.75} />
            </div>
            <div className="home-guide-hub__copy">
              <div className="home-guide-hub__meta">
                <span className="home-guide-hub__count">{count}편</span>
                <span className="home-guide-hub__meta-dot" aria-hidden />
                <span className="home-guide-hub__meta-note">2026 기준</span>
              </div>
              <p className="home-guide-hub__title">가이드 모음 보기</p>
              <p className="home-guide-hub__subtitle">주제별 목록·최신 수정일 확인</p>
            </div>
          </div>

          <span className="home-guide-hub__cta">
            전체 보기
            <ArrowRight size={16} strokeWidth={2.25} className="home-guide-hub__cta-icon" />
          </span>

          <ul className="home-guide-hub__topics" aria-label="가이드 주제">
            {topics.map((tag) => {
              const accent = guideTagColors[tag] ?? '#6bafff'
              return (
                <li key={tag}>
                  <span
                    className="home-guide-hub__topic"
                    style={{ '--topic': accent } as CSSProperties}
                  >
                    <span className="home-guide-hub__topic-dot" aria-hidden />
                    {tag}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Link>
    </section>
  )
}
