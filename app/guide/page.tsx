import type { Metadata } from 'next'
import Link from 'next/link'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  title: '재테크 가이드 | 머니핏 계산기',
  description:
    '2026년 최신 세율·법령을 반영한 연봉·대출·퇴직금·적금·전세·로또 실전 가이드. 공식 법령 조항을 근거로 작성된 독창적 콘텐츠.',
  alternates: { canonical: `${SITE}/guide` },
}

const guides = [
  {
    slug: '2026-salary-tax-guide',
    title: '2026년 연봉 실수령액 완전 가이드',
    desc: '4대보험 요율 변경과 간이세액표 개정을 반영한 계산 공식과 실전 예시.',
    tag: '세금',
    color: '#60a5fa',
  },
  {
    slug: 'dsr-stress-test-2026',
    title: '2026 스트레스 DSR 3단계 완전 정리',
    desc: '가산금리 0.75%p 적용 구간과 주담대·신용대출 영향 분석.',
    tag: '대출',
    color: '#5eead4',
  },
  {
    slug: 'severance-calculation-guide',
    title: '퇴직금 계산 공식과 실전 예시',
    desc: '근로기준법 제34조 평균임금과 통상임금 비교, 소급 인상 반영법.',
    tag: '퇴직',
    color: '#a78bfa',
  },
  {
    slug: 'isa-vs-regular-savings',
    title: 'ISA vs 일반계좌 10년 시뮬레이션',
    desc: '비과세 200만 원 한도의 실제 절세 효과, 만기 전 인출 시 손익.',
    tag: '투자',
    color: '#34d399',
  },
  {
    slug: 'jeonse-safety-2026',
    title: '2026 전세사기 방지 체크리스트',
    desc: 'HUG 보증 가입 조건, 등기부등본 읽는 법, 깡통전세 판별 기준.',
    tag: '부동산',
    color: '#fbbf24',
  },
  {
    slug: 'lotto-tax-guide',
    title: '로또 당첨금 세금·수령 완전 가이드',
    desc: '원천징수 구간, 기타소득 신고, 익명 수령 절차와 유의사항.',
    tag: '복권',
    color: '#f472b6',
  },
]

export default function GuideIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">GUIDES</p>
        <h1 className="font-display text-[30px] md:text-[38px] font-bold text-white tracking-tight">
          재테크 실전 가이드
        </h1>
        <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed max-w-xl">
          2026년 최신 법령·세율을 근거로 작성된 독창 콘텐츠입니다. 계산기 결과를 실무에 어떻게
          적용해야 하는지, 자주 놓치는 예외 상황이 무엇인지 짚어드립니다.
        </p>
      </header>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {guides.map(g => (
          <Link key={g.slug} href={`/guide/${g.slug}`} className="card card-hover p-5 inline-reset">
            <span
              className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full mb-3"
              style={{
                color: g.color,
                background: `${g.color}14`,
                border: `1px solid ${g.color}28`,
              }}
            >
              {g.tag}
            </span>
            <h2 className="font-display text-[16px] font-semibold text-white tracking-tight mb-1.5">
              {g.title}
            </h2>
            <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed">{g.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
