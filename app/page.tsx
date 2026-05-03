import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '머니핏 — 2026년 한국 재테크 계산기',
  description:
    '연봉 실수령액, 퇴직금, 대출 이자, 적금 이자, 전월세 전환까지. 2026년 최신 세율·공제를 반영한 정확한 계산기를 1초 안에.',
  alternates: { canonical: '/' },
}

const CALCS = [
  {
    href: '/salary',
    kicker: 'CALC·01',
    title: '연봉 실수령액',
    body: '2026년 간이세액표 기준. 4대 보험, 소득세, 장기요양(13.14%), 자녀공제까지.',
    sample: '연봉 5,000만원 → 월 실수령 약 352만원',
  },
  {
    href: '/severance',
    kicker: 'CALC·02',
    title: '퇴직금',
    body: '근로기준법상 평균임금 × 30일 × (재직일수 / 365). 실제 역일수로 정확히.',
    sample: '재직 3년, 월 300만원 → 약 900만원',
  },
  {
    href: '/mortgage',
    kicker: 'CALC·03',
    title: '대출 이자',
    body: '원리금균등 · 원금균등 · 만기일시 전상환식 지원. 월별 상환표 포함.',
    sample: '3억 · 30년 · 4.2% → 월 146만원',
  },
  {
    href: '/savings',
    kicker: 'CALC·04',
    title: '적금·예금 이자',
    body: '단리/복리, 정기적금/예금, 이자소득세 15.4% 자동 차감.',
    sample: '월 50만원 · 3년 · 4% → 만기 1,898만원',
  },
  {
    href: '/jeonse',
    kicker: 'CALC·05',
    title: '전월세 전환',
    body: '전세↔월세 변환, 기회비용 기반 손익 비교. 법정 전환율 상한 안내.',
    sample: '전세 3억 · 전환율 5% → 월세 125만원',
  },
  {
    href: '/lotto',
    kicker: 'LUCK·06',
    title: '로또 번호',
    body: '동행복권 공식 추첨 방식을 모사. 암호학적 난수 기반 랜덤 조합.',
    sample: '1~5게임 · 회차·판매마감 시각 안내',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-20">
      {/* ─── Hero ─── */}
      <section className="mb-16 md:mb-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--color-warm)] mb-5">
          EST. 2026 · 한국 재테크 계산기
        </p>
        <h1 className="font-display text-[40px] leading-[1.15] md:text-[64px] md:leading-[1.1] font-bold tracking-tight text-[color:var(--color-ink)]">
          숫자 앞에서<br />
          <span className="hl-warm">흔들리지 않는</span> 방법.
        </h1>
        <p className="mt-6 text-[16px] md:text-[17px] text-[color:var(--color-sub)] leading-relaxed max-w-xl">
          연봉, 퇴직금, 대출, 적금, 전월세 — 2026년 최신 세율과 공제 기준으로
          <br className="hidden md:block" />
          광고로 가리지 않고, 결과부터 크게 보여드립니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link href="/salary" className="inline-reset btn-primary">
            연봉 실수령 계산 →
          </Link>
          <Link href="/mortgage" className="inline-reset btn-ghost">
            대출 이자 보기
          </Link>
        </div>

        {/* micro stats */}
        <dl className="mt-12 grid grid-cols-3 gap-4 md:gap-10 max-w-2xl">
          {[
            { k: '계산기', v: '6개' },
            { k: '데이터 기준', v: '2026년' },
            { k: '서버 저장', v: '0건' },
          ].map(({ k, v }) => (
            <div key={k} className="flex flex-col gap-1">
              <dt className="text-[11px] font-mono tracking-widest uppercase text-[color:var(--color-muted)]">{k}</dt>
              <dd className="font-display text-[22px] md:text-[28px] font-bold text-[color:var(--color-ink)] tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── Calculators grid ─── */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6 rule-strong pt-4">
          <h2 className="font-display text-[22px] md:text-[26px] font-bold">전체 계산기</h2>
          <span className="font-mono text-[11px] tracking-widest text-[color:var(--color-muted)]">
            06 ITEMS
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {CALCS.map(({ href, kicker, title, body, sample }) => (
            <Link
              key={href}
              href={href}
              className="inline-reset editorial-card p-6 md:p-7 group"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-mono text-[11px] tracking-widest text-[color:var(--color-warm)]">{kicker}</span>
                <span
                  aria-hidden
                  className="text-[color:var(--color-sub)] text-lg leading-none transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
              <h3 className="font-display text-[20px] md:text-[22px] font-bold text-[color:var(--color-ink)] mb-2">
                {title}
              </h3>
              <p className="text-[14px] text-[color:var(--color-sub)] leading-relaxed mb-4">
                {body}
              </p>
              <p className="text-[12px] font-mono text-[color:var(--color-ink-2)] bg-[color:var(--color-paper)] rounded px-2.5 py-1.5 inline-block tabular-nums">
                예) {sample}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Editorial note ─── */}
      <section className="rule-strong pt-8">
        <h2 className="font-display text-[22px] md:text-[26px] font-bold mb-4">
          왜 직접 만들었나요?
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed text-[color:var(--color-ink-2)]">
          <p>
            시중 계산기는 <span className="hl-ink">광고와 개인정보 입력</span>이 너무 많습니다.
            주민번호를 넣어야 하거나, 결과를 보려면 앱 설치를 강요받기도 합니다.
            머니핏은 <strong className="text-[color:var(--color-ink)]">아무 것도 서버에 보내지 않습니다</strong> —
            모든 계산은 브라우저 안에서 끝납니다.
          </p>
          <p>
            산식은 국세청 간이세액표, 근로기준법, 금융감독원 공표 기준을 따릅니다.
            세율이 바뀌면 <span className="font-mono text-[13px] text-[color:var(--color-warm)]">
            /lib</span> 파일 하나만 고치면 되도록 설계했어요. 혹시 이상한 결과가 나오면
            GitHub에 이슈를 남겨주세요. 빠르게 고칩니다.
          </p>
        </div>
      </section>
    </div>
  )
}
