import Link from 'next/link'
import type { Metadata } from 'next'
import { Wallet, Home, Briefcase, PiggyBank, Building2, ArrowRight, TrendingUp, Users, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세 무료 계산',
  description: '2026년 최신 기준 한국 재테크 계산기. 연봉 실수령액, 주택담보대출, 퇴직금, 적금/예금, 전세월세 전환을 무료로 계산하세요.',
}

const calculators = [
  {
    href: '/salary',
    icon: Wallet,
    title: '연봉 실수령액 계산기',
    desc: '4대보험·소득세 공제 후 실제 월급 계산',
    example: '연봉 5,000만원 → 월 실수령 약 360만원',
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/30',
    keywords: ['2026 연봉 세후', '월급 실수령', '4대보험 계산'],
  },
  {
    href: '/mortgage',
    icon: Home,
    title: '주택담보대출 이자 계산기',
    desc: '원리금균등·원금균등·만기일시 3가지 방식 비교',
    example: '3억 · 3.5% · 30년 → 월 135만원',
    color: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/30',
    keywords: ['주담대 월 납입금', '이자 총액', '상환 스케줄'],
  },
  {
    href: '/severance',
    icon: Briefcase,
    title: '퇴직금 계산기',
    desc: '입사일·퇴직일·평균임금으로 퇴직금 자동 계산',
    example: '월급 350만 · 5년 → 퇴직금 약 1,750만원',
    color: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/30',
    keywords: ['2026 퇴직금 계산', '평균임금', '퇴직금 얼마'],
  },
  {
    href: '/savings',
    icon: PiggyBank,
    title: '적금/예금 이자 계산기',
    desc: '단리·복리, 이자소득세 15.4% 차감 후 세후 수익 계산',
    example: '월 50만 · 연 3.5% · 12개월 → 세후 +109,200원',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/30',
    keywords: ['적금 만기 이자', '예금 세후 이자', '이자소득세'],
  },
  {
    href: '/jeonse',
    icon: Building2,
    title: '전세↔월세 전환 계산기',
    desc: '전월세 전환율로 전세·월세 중 유리한 방향 비교',
    example: '전세 3억 → 보증금 5천+월세 약 104만원',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/30',
    keywords: ['전월세 전환율', '전세→월세', '월세→전세'],
  },
]

const stats = [
  { icon: TrendingUp, label: '최신 세율 반영', value: '2026년' },
  { icon: Users, label: '서버 비용', value: '완전 무료' },
  { icon: Star, label: '실시간 계산', value: '즉시 결과' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* 히어로 */}
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 mb-4">
          2026년 최신 세율 자동 적용
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          한국 재테크<br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            스마트 계산기
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          연봉 실수령액부터 대출 이자, 퇴직금, 적금, 전월세 전환까지<br />
          복잡한 계산을 1초 만에 해결하세요.
        </p>

        {/* 통계 */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">{label}</span>
              <span className="text-sm font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 계산기 카드 그리드 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 text-center">계산기 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculators.map(({ href, icon: Icon, title, desc, example, color, glow, keywords }) => (
            <Link key={href} href={href} className="group block">
            <div className="h-full glass-card rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{ cursor: 'pointer' }}>
                {/* 아이콘 */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${glow} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* 제목 & 설명 */}
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-white/60 mb-3">{desc}</p>

                {/* 예시 */}
                <div className="text-xs font-medium text-white/70 bg-white/5 rounded-lg px-3 py-2 mb-4 border border-white/10">
                  예시: {example}
                </div>

                {/* 키워드 태그 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {keywords.map((kw) => (
                    <span key={kw} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                  계산하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO 텍스트 섹션 */}
      <section className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-4">왜 머니핏 계산기를 사용해야 할까요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/60">
          <div>
            <h3 className="font-semibold text-white mb-2">2026년 최신 기준 자동 적용</h3>
            <p>국민연금 4.75%, 건강보험 3.595%, 장기요양보험 13.14% 등 2026년 최신 4대보험료율과 근로소득세 간이세액표를 자동으로 반영합니다.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">서버 없이 완전 무료</h3>
            <p>모든 계산이 브라우저에서 직접 처리되어 개인정보가 서버로 전송되지 않습니다. 완전 무료이며 회원가입 없이 사용 가능합니다.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">실시간 결과 확인</h3>
            <p>입력 필드를 조작하면 즉시 결과가 업데이트됩니다. 시뮬레이션으로 다양한 조건을 비교해보세요.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
